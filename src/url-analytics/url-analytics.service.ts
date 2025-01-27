import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlAnalytics } from '@/url-analytics/entities/url-analytics.entity';
import { Repository } from 'typeorm';
import { LoggerService } from '@/logger/logger.service';
import { CreateUrlAnalyticsDto } from '@/url-analytics/dto/create-analytics.dto';
import { lookup } from 'geoip-country';
import { UAParser } from 'ua-parser-js';
import { AnalyticsQueryDto } from '@/url-analytics/dto/query-analytics.dto';

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
				browser: browser?.toLowerCase(),
				device: device?.toLowerCase(),
				operating_system: os?.toLowerCase(),
				country,
			};
			const redirectionLogs = await this.analyticsRepo.insert(analytics);
			console.log(redirectionLogs);
		} catch (error) {
			console.log(error);
			return;
		}
	}

	async getUserSpecificAnalysis(userId: string, query: AnalyticsQueryDto): Promise<UrlAnalytics[]> {
		const { from, to, browser, device, os, groupBy, clicked_at } = query;
		const fromDate = new Date(from);
		const toDate = new Date(to);
		const clickedAtDate = new Date(clicked_at);
		const eod = new Date(clicked_at);
		eod.setDate(eod.getDate() + 1);
		const queryBuilder = this.analyticsRepo
			.createQueryBuilder('redirection_logs')
			.select([
				`redirection_logs.id AS id`,
				`redirection_logs.short_url_id AS urlId`,
				`redirection_logs.clicked_at AS clickedAt`,
				`redirection_logs.country AS country`,
				`redirection_logs.operating_system AS operatingSystem`,
				`redirection_logs.device AS device`,
				`redirection_logs.browser AS browser`,
			])
			.where('user_id = :userId', { userId });
		if (from && to) {
			queryBuilder.andWhere('redirection_logs.clicked_at >= :from AND redirection_logs.clicked_at <= :to', {
				from: fromDate,
				to: toDate,
			});
		}
		if (from) queryBuilder.andWhere('redirection_logs.clicked_at >= :from', { from: fromDate });
		if (to) queryBuilder.andWhere('redirection_logs.clicked_at <= :to', { to: toDate });
		if (device) queryBuilder.andWhere('redirection_logs.device = :device', { device });
		if (browser) queryBuilder.andWhere('redirection_logs.browser = :browser', { browser });
		if (os) queryBuilder.andWhere('redirection_logs.operating_system = :device', { os });
		if (clicked_at)
			queryBuilder.andWhere('redirection_logs.clicked_at >= :clickedAtDate AND redirection_logs.clicked_at < :eod', {
				clickedAtDate,
				eod,
			});
		if (groupBy) {
			if (groupBy == 'clicked_at') {
				queryBuilder
					.select([
						`DATE(redirection_logs.${groupBy}) AS ${groupBy} `,
						`COUNT(redirection_logs.${groupBy}) AS numberOfHits`,
					])
					.groupBy(`DATE(redirection_logs.${groupBy})`);
			} else {
				queryBuilder
					.select([`redirection_logs.${groupBy} AS ${groupBy} `, `COUNT(redirection_logs.${groupBy}) AS numberOfHits`])
					.groupBy(`redirection_logs.${groupBy} `);
			}
		}
		const reports = await queryBuilder.getRawMany();

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
