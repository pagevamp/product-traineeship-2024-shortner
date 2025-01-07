import { MailerService } from '@/mailer/mailer.service';
import { signupOtpMailTemplate } from '@/template/email.template';
import { User } from '@/users/entities/user.entity';
import { VerificationService } from '@/verification/verification.service';
import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		private otpVerificationService: VerificationService,
		private emailService: MailerService,
	) {}
	async sendEmailVerification(email: string): Promise<void> {
		const user = await this.usersRepository.findOne({ where: { email: email } });
		if (!user) {
			throw new NotFoundException('User not found.');
		}
		if (user.verified_at) {
			throw new UnprocessableEntityException('Account already verified.');
		}
		const otp = await this.otpVerificationService.createOtp(user.id);
		this.emailService.sendEmail({
			subject: signupOtpMailTemplate.subject,
			to: [{ name: user.name ?? '', address: user.email }],
			html: signupOtpMailTemplate.body(otp, user.name),
		});
	}

	async verifyEmail(email: string, otp: string): Promise<boolean> {
		const user = await this.usersRepository.findOne({ where: { email } });
		if (!user) {
			throw new NotFoundException('User not found.');
		}
		if (user.verified_at) {
			throw new UnprocessableEntityException('Account already verified.');
		}
		const isVerifiedSuccessfully = await this.otpVerificationService.validateOtp(user.id, otp);
		if (!isVerifiedSuccessfully) {
			throw new UnprocessableEntityException('Failed to verify user.');
		}
		user.verified_at = new Date();
		await this.usersRepository.save(user);
		return true;
	}
}
