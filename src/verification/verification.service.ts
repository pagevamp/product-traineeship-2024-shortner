import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Verification } from './entities/verification.entity';
import { MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { generateOtp } from './util/otp.util';
import bcrypt from 'bcrypt';

@Injectable()
export class VerificationService {
	private readonly minutesToMakeNewOtpRequest = 2;
	private readonly otpExpirationMinutes = 15;
	constructor(
		@InjectRepository(Verification)
		private otpRepository: Repository<Verification>,
	) {}

	async createOtp(user_id: string, size = 6): Promise<string> {
		const recentToken = await this.otpRepository.findOne({
			where: {
				user_id,
				created_at: MoreThan(new Date(new Date().getTime() - this.minutesToMakeNewOtpRequest * 60 * 1000)),
			},
		});
		if (recentToken) {
			throw new UnprocessableEntityException(
				`Please wait ${this.minutesToMakeNewOtpRequest} minutes to make new request.`,
			);
		}
		const otp = generateOtp(size);
		const hashedCode = await bcrypt.hash(otp, 10);
		const otpEntity = this.otpRepository.create({
			user_id,
			otp_code: hashedCode,
			expires_at: new Date(new Date().getTime() + this.otpExpirationMinutes * 60 * 1000),
		});
		await this.otpRepository.delete({ user_id });
		await this.otpRepository.save(otpEntity);
		return otp;
	}

	async validateOtp(user_id: string, otp: string): Promise<boolean> {
		const validOtp = await this.otpRepository.findOne({
			where: { user_id, expires_at: MoreThan(new Date()) },
		});
		if (validOtp && (await bcrypt.compare(otp, validOtp.otp_code))) {
			await this.otpRepository.remove(validOtp);
			return true;
		} else {
			return false;
		}
	}
}
