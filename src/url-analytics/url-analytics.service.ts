import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlAnalytics } from '@/url-analytics/entities/url-analytics.entity';
import { Repository } from 'typeorm';
import { CreateUrlAnalyticsDto } from '@/url-analytics/dto/create-analytics.dto';
import { lookup } from 'geoip-country';
import { UAParser } from 'ua-parser-js';
import { AnalyticsQueryDto } from '@/url-analytics/dto/query-analytics.dto';
import { successMessage } from '@/common/messages';
import { LoggerService } from '@/logger/logger.service';

@Injectable()
export class UrlAnalyticsService {
	constructor(
		@InjectRepository(UrlAnalytics)
		private logger: LoggerService,
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
			browser: browser?.toLowerCase(),
			device: device?.toLowerCase(),
			operating_system: os?.toLowerCase(),
			country,
		};
		await this.analyticsRepo.insert(analytics);
	}

	async getUserSpecificAnalysis(userId: string, query: AnalyticsQueryDto): Promise<UrlAnalytics[]> {
		const { from, to, browser, device, os, groupBy, clicked_at, country } = query;
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
		if (from || to) {
			queryBuilder.andWhere('redirection_logs.clicked_at BETWEEN :from AND :to', {
				from: from ? new Date(from) : new Date(0),
				to: to ? new Date(to) : new Date(),
			});
		}
		if (device) {
			const deviceArr: string[] = device.includes(',') ? device.split(',') : [device];
			queryBuilder.andWhere('redirection_logs.device IN (:...deviceArr)', { deviceArr });
		}
		if (browser) {
			const browserArr: string[] = browser.includes(',') ? browser.split(',') : [browser];
			queryBuilder.andWhere('redirection_logs.browser IN (:...browserArr)', { browserArr });
		}
		if (os) {
			const osArr: string[] = os.includes(',') ? os.split(',') : [os];
			queryBuilder.andWhere('redirection_logs.operating_system IN (:...osArr)', { osArr });
		}
		if (country) {
			const countryArr: string[] = country.includes(',') ? country.split(',') : [country];
			queryBuilder.andWhere('redirection_logs.country IN (:...countryArr)', { countryArr });
		}
		if (clicked_at) {
			const clickedAtDate = new Date(clicked_at);
			const eod = new Date(clicked_at);
			eod.setDate(eod.getDate() + 1);
			queryBuilder.andWhere('redirection_logs.clicked_at >= :clickedAtDate AND redirection_logs.clicked_at < :eod', {
				clickedAtDate,
				eod,
			});
		}

		if (groupBy) {
			const grpByArr = groupBy.includes(',') ? groupBy.split(',') : [groupBy];
			queryBuilder.select(`COUNT(redirection_logs.id) AS numberOfHits`);

			for (let i = 0; i < grpByArr.length; i++) {
				switch (grpByArr[i]) {
					case 'clicked_at':
						queryBuilder
							.addSelect([`DATE(redirection_logs.${grpByArr[i]}) AS ${grpByArr[i]} `])
							.addGroupBy(`DATE(redirection_logs.${grpByArr[i]})`);

						break;
					default:
						queryBuilder
							.addSelect([`redirection_logs.${grpByArr[i]} AS ${grpByArr[i]} `])
							.addGroupBy(`redirection_logs.${grpByArr[i]} `);
				}
			}
		}
		const reports = await queryBuilder.getRawMany();
		this.logger.log(successMessage.fetchedAnalytics);
		return reports;
	}

	private async parseUserAgent(
		userAgent: string,
	): Promise<{ browser: string | undefined; device: string | undefined; os: string | undefined }> {
		const parsedUA = UAParser(userAgent);
		let browser = parsedUA.browser.name ?? 'unknown';
		if (browser.startsWith('Mobile ')) {
			browser = browser.replace('Mobile ', '');
		}
		const device = parsedUA.device.type ?? 'desktop';
		const os = parsedUA.os.name ?? 'unknown';
		return { browser, device, os };
	}

	private async getCountryFromIP(ip: string): Promise<string | undefined> {
		const location = lookup(ip);
		return location?.country;
	}
}
