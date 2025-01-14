import { HttpStatus, Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { env } from '@/config/env.config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';
import { Equal, Repository, TypeORMError } from 'typeorm';
import { hash } from 'bcrypt';
import { SuccessResponse } from '@/common/response.interface';
import { errorMessage, successMessage } from '@/common/messages';
import { VerificationService } from '@/verification/verification.service';
import { MailerService } from '@/mailer/mailer.service';
import { signupOtpMailTemplate } from '@/template/email.template';
import { VerifyUserDto } from '@/users/dto/verify-user.dto';
import { SendVerificationDto } from '@/users/dto/send-verification.dto';
@Injectable()
export class UsersService {
	constructor(
		private readonly logger: Logger,
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private otpVerificationService: VerificationService,
		private emailService: MailerService,
	) {}
	async create(createUserDto: CreateUserDto): Promise<SuccessResponse> {
		const passwordHash = await hash(createUserDto.password, env.SALT_ROUND);
		const user = { ...createUserDto, password_hash: passwordHash };
		const createdUser = (await this.userRepository.insert(user)).generatedMaps[0];
		if (!createdUser) {
			throw new TypeORMError(errorMessage.userCreationFailure);
		}
		this.logger.log(` New user ${createUserDto.name}  created`);
		return {
			status: HttpStatus.CREATED,
			message: successMessage.userCreated,
		};
	}

	async findByEmail(email: string): Promise<User> {
		const user = await this.userRepository.findOneBy({ email });
		if (!user) {
			throw new NotFoundException(errorMessage.userNotFound);
		}
		return user;
	}
	async sendEmailVerification({ email }: SendVerificationDto): Promise<SuccessResponse> {
		const user = await this.userRepository.findOne({ where: { email: Equal(email) } });
		if (!user) {
			throw new NotFoundException(errorMessage.userNotFound);
		}
		if (user.verified_at) {
			throw new UnprocessableEntityException(errorMessage.userAlreadyVerified);
		}
		const otp = await this.otpVerificationService.createOtp(user.id);
		this.emailService.sendEmail({
			subject: signupOtpMailTemplate.subject,
			to: [{ name: user.name, address: user.email }],
			html: signupOtpMailTemplate.body(otp, user.name),
		});
		return {
			status: HttpStatus.OK,
			message: successMessage.verificationEmailSent,
		};
	}

	async verifyEmail({ email, otp }: VerifyUserDto): Promise<SuccessResponse> {
		const user = await this.userRepository.findOne({ where: { email } });
		if (!user) {
			throw new NotFoundException(errorMessage.userNotFound);
		}
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
		return {
			status: HttpStatus.OK,
			message: successMessage.userVerified,
		};
	}
}
