import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlAnalytics } from '@/url-analytics/entities/url-analytics.entity';
import { Repository } from 'typeorm';
import { CreateUrlAnalyticsDto } from '@/url-analytics/dto/create-analytics.dto';
import { lookup } from 'geoip-country';
import { UAParser } from 'ua-parser-js';

@Injectable()
export class UrlAnalyticsService {
	constructor(
		@InjectRepository(UrlAnalytics)
		private analyticsRepo: Repository<UrlAnalytics>,
	) {}

	async createAnalytics(records: CreateUrlAnalyticsDto): Promise<void> {
		const { shortUrlId, userAgent, userId, ipAddress } = records;
		const { browser, device, os } = await this.parseUserAgent(userAgent);
		const country = await this.getCountryFromIP(ipAddress);
		const analytics = {
			short_url_id: shortUrlId,
			user_id: userId,
			user_agent: userAgent,
			ip_address: ipAddress,
			browser,
			device,
			operating_system: os,
			country,
		};
		await this.analyticsRepo.insert(analytics);
	}

	private async parseUserAgent(
		userAgent: string,
	): Promise<{ browser: string | undefined; device: string | undefined; os: string | undefined }> {
		const parsedUA = UAParser(userAgent);
		let browser = parsedUA.browser.name ?? 'Unknown';
		if (browser.startsWith('Mobile ')) {
			browser = browser.replace('Mobile ', '');
		}
		const device = parsedUA.device.type ?? 'Desktop';
		const os = parsedUA.os.name ?? 'Unknown';
		return { browser, device, os };
	}

	private async getCountryFromIP(ip: string): Promise<string | undefined> {
		const location = lookup(ip);
		return location?.country;
	}
}
