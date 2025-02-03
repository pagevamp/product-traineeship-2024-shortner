import { HttpException, HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { env } from '@/config/env.config';
import { Verification } from '@/verification/entities/verification.entity';
import { generateOtp } from '@/verification/util/otp.util';
import { errorMessage, successMessage } from '@/common/messages';
import { LoggerService } from '@/logger/logger.service';

@Injectable()
export class VerificationService {
	private readonly minutesToMakeNewOtpRequest = 2 * 60 * 1000;
	private readonly otpExpirationMinutes = 15 * 60 * 1000;
	constructor(
		private readonly logger: LoggerService,
		@InjectRepository(Verification)
		private otpRepository: Repository<Verification>,
	) {}
	/**
	 * Creates a new record in database with otp code for a particular user id and returns it.
	 * This first deletes any record found for a user id in database first and then save new record.
	 * @param userId
	 */
	async createOtp(userId: string): Promise<string> {
		const recentOtpRequest = await this.otpRepository.findOne({
			where: {
				user_id: userId,
				created_at: MoreThan(new Date(new Date().getTime() - this.minutesToMakeNewOtpRequest)),
			},
		});
		if (recentOtpRequest) {
			throw new HttpException(`Please wait two minutes to make new request.`, HttpStatus.TOO_MANY_REQUESTS);
		}
		const otp = generateOtp();
		const hashedOtp = await hash(otp, env.SALT_ROUND);
		const saveOtp = this.otpRepository.create({
			user_id: userId,
			otp_code: hashedOtp,
			expires_at: new Date(new Date().getTime() + this.otpExpirationMinutes),
		});
		await this.otpRepository.delete({ user_id: userId });
		await this.otpRepository.save(saveOtp);
		return otp;
	}

	/**
	 * Checks and verifies the OTP code provided in the database and returns true if success.
	 * This also removes the code from the database after it is verified successfully.
	 * @param userId
	 * @param otp
	 */
	async validateThenRemoveOtp(userId: string, otp: string): Promise<boolean> {
		const validOtp = await this.otpRepository.findOne({
			where: { user_id: userId, expires_at: MoreThan(new Date()) },
		});
		if (!validOtp) {
			throw new UnprocessableEntityException(errorMessage.invalidOrExpiredOtp);
		}
		const result = await compare(otp, validOtp.otp_code);
		if (!result) {
			throw new UnprocessableEntityException(errorMessage.invalidOrExpiredOtp);
		}
		await this.otpRepository.remove(validOtp);
		return true;
	}

	async removeExpiredOtp(): Promise<void> {
		const expiredOtp = await this.otpRepository.find({
			where: { expires_at: LessThan(new Date()) },
		});
		if (expiredOtp.length === 0) {
			return;
		}
		await this.otpRepository.remove(expiredOtp);
		this.logger.log(successMessage.expiryOtpDeleted);
	}
}
