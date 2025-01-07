import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Verification } from './entities/verification.entity';
import { MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { generateOtp } from './util/otp.util';
import { hash, compare } from 'bcrypt';

@Injectable()
export class VerificationService {
	private readonly minutesToMakeNewOtpRequest = 2;
	private readonly otpExpirationMinutes = 15;
	constructor(
		@InjectRepository(Verification)
		private otpRepository: Repository<Verification>,
	) {}

	async createOtp(user_id: string, size = 6): Promise<string> {
		const recentOtpRequest = await this.otpRepository.findOne({
			where: {
				user_id,
				created_at: MoreThan(new Date(new Date().getTime() - this.minutesToMakeNewOtpRequest * 60 * 1000)),
			},
		});
		if (recentOtpRequest) {
			throw new UnprocessableEntityException(
				`Please wait ${this.minutesToMakeNewOtpRequest} minutes to make new request.`,
			);
		}
		const otp = generateOtp(size);
		const hashedOtp = await hash(otp, 10);
		const saveOtp = this.otpRepository.create({
			user_id,
			otp_code: hashedOtp,
			expires_at: new Date(new Date().getTime() + this.otpExpirationMinutes * 60 * 1000),
		});
		await this.otpRepository.delete({ user_id });
		await this.otpRepository.save(saveOtp);
		return otp;
	}

	async validateOtp(user_id: string, otp: string): Promise<boolean> {
		const validOtp = await this.otpRepository.findOne({
			where: { user_id, expires_at: MoreThan(new Date()) },
		});
		if (!validOtp) {
			throw new NotFoundException('Invalid or expired OTP.');
		}
		const deHashedOtp = await compare(otp, validOtp.otp_code);
		if (validOtp && deHashedOtp) {
			await this.otpRepository.remove(validOtp);
			return true;
		} else {
			return false;
		}
	}
}
