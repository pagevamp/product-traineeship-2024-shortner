import { HttpException, HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { env } from '@/config/env.config';
import { Verification } from '@/verification/entities/verification.entity';
import { generateOtp } from '@/verification/util/otp.util';
import { errorMessage } from '@/common/messages';

@Injectable()
export class VerificationService {
	private readonly minutesToMakeNewOtpRequest = 2;
	private readonly otpExpirationMinutes = 15;
	constructor(
		@InjectRepository(Verification)
		private otpRepository: Repository<Verification>,
	) {}

	async createOtp(user_id: string): Promise<string> {
		const recentOtpRequest = await this.otpRepository.findOne({
			where: {
				user_id,
				created_at: MoreThan(new Date(new Date().getTime() - this.minutesToMakeNewOtpRequest * 60 * 1000)),
			},
		});
		if (recentOtpRequest) {
			throw new HttpException(
				`Please wait ${this.minutesToMakeNewOtpRequest} minutes to make new request.`,
				HttpStatus.TOO_MANY_REQUESTS,
			);
		}
		const otp = generateOtp();
		const hashedOtp = await hash(otp, env.SALT_ROUND);
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
			throw new UnprocessableEntityException(errorMessage.invalidOrExpiredOtp);
		}
		const result = await compare(otp, validOtp.otp_code);
		if (!result) {
			throw new UnprocessableEntityException(errorMessage.invalidOrExpiredOtp);
		}
		if (validOtp && result) {
			await this.otpRepository.remove(validOtp);
			return true;
		} else {
			return false;
		}
	}
}
