import { Injectable } from '@nestjs/common';
import { ShortUrlsService } from '@/short-urls/short-urls.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronService {
	constructor(private readonly shortUrlService: ShortUrlsService) {}
	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async checkExpiry(): Promise<void> {
		await this.shortUrlService.checkURLExpiry();
	}
}
