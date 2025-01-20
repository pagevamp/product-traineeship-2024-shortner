import { Injectable } from '@nestjs/common';
import { ShortUrlsService } from '@/short-urls/short-urls.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronService {
	constructor(private readonly shortUrlService: ShortUrlsService) {}
	@Cron(CronExpression.EVERY_10_SECONDS)
	async checkExpiry(): Promise<void> {
		await this.shortUrlService.checkURLExpiry();
	}
}
