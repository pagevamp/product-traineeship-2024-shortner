import { BadRequestException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { env } from '@/config/env.config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';
import { Repository, TypeORMError } from 'typeorm';
import { hash } from 'bcrypt';
import { errorMessage } from '@/common/messages';
import { VerificationService } from '@/verification/verification.service';
import { MailerService } from '@/mailer/mailer.service';
import { signupOtpMailTemplate } from '@/template/email.template';
import { VerifyUserDto } from '@/users/dto/verify-user.dto';
import { SendVerificationDto } from '@/users/dto/send-verification.dto';
import { LoggerService } from '@/logger/logger.service';
@Injectable()
export class UsersService {
	constructor(
		private readonly logger: LoggerService,
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private otpVerificationService: VerificationService,
		private emailService: MailerService,
	) {}
	async create(createUserDto: CreateUserDto): Promise<User> {
		const userExists = await this.userRepository.findOneBy({ email: createUserDto.email });
		if (userExists) {
			throw new BadRequestException(errorMessage.userAlreadyExists);
		}
		const passwordHash = await hash(createUserDto.password, env.SALT_ROUND);
		const user = { ...createUserDto, password_hash: passwordHash };
		const createdUser = (await this.userRepository.insert(user)).generatedMaps[0];
		if (!createdUser) {
			throw new TypeORMError(errorMessage.userCreationFailure);
		}
		this.logger.log(`New user ${createUserDto.name} created`);
		await this.sendEmailVerification({ email: user.email });
		return createdUser as User;
	}

	async findByEmail(email: string): Promise<User> {
		const user = await this.userRepository.findOneBy({ email });
		if (!user) {
			throw new NotFoundException(errorMessage.userNotFound);
		}
		return user;
	}

	async sendEmailVerification({ email }: SendVerificationDto): Promise<void> {
		const user = await this.findByEmail(email);
		if (user.verified_at) {
			throw new UnprocessableEntityException(errorMessage.userAlreadyVerified);
		}
		const otp = await this.otpVerificationService.createOtp(user.id);
		await this.emailService.sendEmail({
			subject: signupOtpMailTemplate.subject,
			to: [{ name: user.name, address: user.email }],
			html: signupOtpMailTemplate.body(otp, user.name),
		});
	}

	async verifyEmail({ email, otp }: VerifyUserDto): Promise<User> {
		const user = await this.findByEmail(email);
		if (user.verified_at) {
			throw new UnprocessableEntityException(errorMessage.userAlreadyVerified);
		}
		const isVerifiedSuccessfully = await this.otpVerificationService.validateThenRemoveOtp(user.id, otp);
		if (!isVerifiedSuccessfully) {
			throw new UnprocessableEntityException(errorMessage.userVerificationFailed);
		}
		user.verified_at = new Date();
		await this.userRepository.save(user);
		this.logger.log(`${email} verified successfully.`);
		return user;
	}
}
