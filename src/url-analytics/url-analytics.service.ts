import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlAnalytics } from '@/url-analytics/entities/url-analytics.entity';
import { Repository } from 'typeorm';
import { LoggerService } from '@/logger/logger.service';
import { CreateUrlAnalyticsDto } from '@/url-analytics/dto/create-analytics.dto';
import { lookup } from 'geoip-country';
import { UAParser } from 'ua-parser-js';

@Injectable()
export class UrlAnalyticsService {
	constructor(
		@InjectRepository(UrlAnalytics)
		private analyticsRepo: Repository<UrlAnalytics>,
		private readonly logger: LoggerService,
	) {}

	async createAnalytics(records: CreateUrlAnalyticsDto): Promise<void> {
		try {
			const { shortUrlId, userAgent, userId, ipAddress, shortURL } = records;
			const { browser, device, os } = await this.parseUserAgent(userAgent);
			const country = await this.getCountryFromIP(ipAddress);
			const analytics = {
				short_url_id: shortUrlId,
				shortURL,
				user_id: userId,
				user_agent: userAgent,
				ip_address: ipAddress,
				browser,
				device,
				operating_system: os,
				country,
			};
			const redirectionLogs = await this.analyticsRepo.insert(analytics);
			console.log(redirectionLogs);
		} catch (error) {
			console.log(error);
			return;
		}
	}

	async getUserSpecificAnalysis(userId: string): Promise<UrlAnalytics[]> {
		const reports = await this.analyticsRepo.find({
			where: {
				user_id: userId,
			},
			select: {
				id: true,
				short_url_id: true,
				clicked_at: true,
				ip_address: true,
				country: true,
				browser: true,
				device: true,
				operating_system: true,
			},
		});
		return reports;
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
		console.log(location);
		return location?.country;
	}
}
