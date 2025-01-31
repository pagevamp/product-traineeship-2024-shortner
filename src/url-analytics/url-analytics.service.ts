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
		private logger: LoggerService,
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
			browser: browser?.toLowerCase(),
			device: device?.toLowerCase(),
			operating_system: os?.toLowerCase(),
			country,
		};
		await this.analyticsRepo.insert(analytics);
	}

	async getUserSpecificAnalysis(userId: string, query: AnalyticsQueryDto): Promise<UrlAnalytics[]> {
		const {
			startDate,
			endDate,
			browser,
			device,
			os,
			groupBy,
			clickedAt,
			country,
			urlId,
			page = 1,
			limit = 10,
			sortBy = 'clicked_at',
			order = 'DESC',
		} = query;
		const queryBuilder = this.analyticsRepo
			.createQueryBuilder('logs')
			.leftJoin('logs.short_url', 'shortUrl')
			.select([
				`logs.id AS id`,
				`logs.short_url_id AS "urlId"`,
				`shortUrl.short_code AS "urlCode"`,
				`shortUrl.original_url AS "originalUrl"`,
				`logs.clicked_at AS "clickedAt"`,
				`logs.country AS country`,
				`logs.operating_system AS "OS"`,
				`logs.device AS device`,
				`logs.browser AS browser`,
			])
			.where('shortUrl.user_id = :userId', { userId });
		if (startDate || endDate) {
			queryBuilder.andWhere('DATE(logs.clicked_at) BETWEEN :startDate AND :endDate', {
				startDate: startDate ?? new Date(0),
				endDate: endDate ?? new Date(),
			});
		}
		if (device) {
			const deviceArr: string[] = device.includes(',') ? device.split(',') : [device];
			queryBuilder.andWhere('logs.device IN (:...deviceArr)', { deviceArr });
		}
		if (browser) {
			const browserArr: string[] = browser.includes(',') ? browser.split(',') : [browser];
			queryBuilder.andWhere('logs.browser IN (:...browserArr)', { browserArr });
		}
		if (os) {
			const osArr: string[] = os.includes(',') ? os.split(',') : [os];
			queryBuilder.andWhere('logs.operating_system IN (:...osArr)', { osArr });
		}
		if (country) {
			const countryArr: string[] = country.includes(',') ? country.split(',') : [country];
			queryBuilder.andWhere('logs.country IN (:...countryArr)', { countryArr });
		}
		if (urlId) {
			const urlIdArr: string[] = urlId.includes(',') ? urlId.split(',') : [urlId];
			queryBuilder.andWhere('logs.short_url_id IN (:...urlIdArr)', { urlIdArr });
		}
		if (clickedAt) {
			const eod = new Date(clickedAt);
			eod.setDate(eod.getDate() + 1);
			queryBuilder.andWhere('logs.clicked_at >= :clickedAt AND logs.clicked_at < :eod', {
				clickedAt,
				eod,
			});
		}

		if (groupBy) {
			const grpByArr = groupBy.includes(',') ? groupBy.split(',') : [groupBy];
			queryBuilder.select(`COUNT(logs.id) AS numberOfHits`);

			for (let i = 0; i < grpByArr.length; i++) {
				switch (grpByArr[i]) {
					case 'clicked_at':
						queryBuilder
							.addSelect([`DATE(logs.${grpByArr[i]}) AS ${grpByArr[i]} `])
							.addGroupBy(`DATE(logs.${grpByArr[i]})`);

						break;
					default:
						queryBuilder.addSelect([`logs.${grpByArr[i]} AS ${grpByArr[i]} `]).addGroupBy(`logs.${grpByArr[i]} `);
				}
			}
		} else {
			queryBuilder.orderBy(`logs.${sortBy}`, order);
		}
		const skip = (page - 1) * limit;
		queryBuilder.skip(skip).limit(limit);

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
