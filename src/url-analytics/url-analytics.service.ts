import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlAnalytics } from '@/url-analytics/entities/url-analytics.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
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
			const deviceArr: string[] = await this.parseQuerytoArray(device);
			queryBuilder.andWhere('logs.device IN (:...deviceArr)', { deviceArr });
		}
		if (browser) {
			const browserArr: string[] = await this.parseQuerytoArray(browser);
			queryBuilder.andWhere('logs.browser IN (:...browserArr)', { browserArr });
		}
		if (os) {
			const osArr: string[] = await this.parseQuerytoArray(os);
			queryBuilder.andWhere('logs.operating_system IN (:...osArr)', { osArr });
		}
		if (country) {
			const countryArr: string[] = await this.parseQuerytoArray(country);
			queryBuilder.andWhere('logs.country IN (:...countryArr)', { countryArr });
		}
		if (urlId) {
			const urlIdArr: string[] = await this.parseQuerytoArray(urlId);
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
			const grpByArr = await this.parseQuerytoArray(groupBy);
			await this.filterQueryByGroupBy(queryBuilder, grpByArr);
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

	private async parseQuerytoArray(queryKey: string): Promise<string[]> {
		const queryKeyArray: string[] = queryKey.split(',');
		return queryKeyArray;
	}

	private async filterQueryByGroupBy(
		queryBuilder: SelectQueryBuilder<UrlAnalytics>,
		grpByArr: string[],
	): Promise<void> {
		queryBuilder.select(`COUNT(logs.id) AS numberOfHits`);
		for (const field of grpByArr) {
			switch (field) {
				case 'clicked_at':
					queryBuilder.addSelect(['DATE(logs.clicked_at) AS "clickedAt"']).addGroupBy('DATE(logs.clicked_at)');
					break;
				default:
					queryBuilder.addSelect([`logs.${field} AS ${field} `]).addGroupBy(`logs.${field} `);
			}
		}
		return;
	}
}
