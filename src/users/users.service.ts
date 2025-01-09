import { HttpStatus, Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { env } from '@/config/env.config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { SuccessResponse } from '@/common/response.interface';
import { errorMessage, successMessage } from '@/common/messages';
import { VerificationService } from '@/verification/verification.service';
import { MailerService } from '@/mailer/mailer.service';
import { signupOtpMailTemplate } from '@/template/email.template';
@Injectable()
export class UsersService {
	private readonly logger = new Logger();
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private otpVerificationService: VerificationService,
		private emailService: MailerService,
	) {}
	async create(createUserDto: CreateUserDto): Promise<SuccessResponse | undefined> {
		try {
			const passwordHash = await hash(createUserDto.password, env.SALT_ROUND);
			const user = { ...createUserDto, password_hash: passwordHash };
			const createdUser = (await this.userRepository.insert(user)).generatedMaps[0];
			if (createdUser) {
				this.logger.log(` New user ${createUserDto.name}  created`);
				return {
					status: HttpStatus.CREATED,
					message: successMessage.userCreated,
				};
			}
		} catch (error) {
			this.logger.error(error);
		}
	}

	async sendEmailVerification(email: string): Promise<boolean> {
		const user = await this.userRepository.findOne({ where: { email: email } });
		if (!user) {
			throw new NotFoundException(errorMessage.userNotFound);
		}
		if (user.verified_at) {
			throw new UnprocessableEntityException(errorMessage.userAlreadyVerified);
		}
		const otp = await this.otpVerificationService.createOtp(user.id);
		this.emailService.sendEmail({
			subject: signupOtpMailTemplate.subject,
			to: [{ name: user.name ?? '', address: user.email }],
			html: signupOtpMailTemplate.body(otp, user.name),
		});
		return true;
	}

	async verifyEmail(email: string, otp: string): Promise<SuccessResponse> {
		const user = await this.userRepository.findOne({ where: { email } });
		if (!user) {
			throw new NotFoundException(errorMessage.userNotFound);
		}
		if (user.verified_at) {
			throw new UnprocessableEntityException(errorMessage.userAlreadyVerified);
		}
		const isVerifiedSuccessfully = await this.otpVerificationService.validateOtp(user.id, otp);
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
