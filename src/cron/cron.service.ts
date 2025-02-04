import { Injectable } from '@nestjs/common';
import { ShortUrlsService } from '@/short-urls/short-urls.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { VerificationService } from '@/verification/verification.service';

@Injectable()
export class CronService {
	constructor(
		private readonly shortUrlService: ShortUrlsService,
		private readonly verificationService: VerificationService,
	) {}
	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async checkExpiry(): Promise<void> {
		await this.shortUrlService.checkURLExpiry();
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async checkAndDeleteExpiredOtp(): Promise<void> {
		await this.verificationService.removeExpiredOtp();
	}
}
