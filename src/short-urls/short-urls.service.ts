import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { HTMLTemplateForRedirection } from '@/template/redirect.template';
import { CreateShortUrlDto } from '@/short-urls/dto/create-short-url.dto';
import { errorMessage, successMessage } from '@/common/messages';
import { ShortUrl } from '@/short-urls/entities/short-url.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Repository, TypeORMError, UpdateResult } from 'typeorm';
import { generateUrlCode } from '@/short-urls/util/generate-url-code';
import { TemplateResponse } from '@/common/response.interface';
import { User } from '@/users/entities/user.entity';
import { LoggerService } from '@/logger/logger.service';
import { UrlAnalyticsService } from '@/url-analytics/url-analytics.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { UpdateShortUrlDto } from '@/short-urls/dto/update-short-url.dto';

@Injectable()
export class ShortUrlsService {
	constructor(
		private readonly logger: LoggerService,
		@InjectRepository(ShortUrl)
		private shortUrlRepository: Repository<ShortUrl>,
		private readonly analyticsService: UrlAnalyticsService,
		@InjectQueue('notifyExpiredUrl') private readonly queueService: Queue,
	) {}
	private readonly template = new HTMLTemplateForRedirection();
	async createShortUrl(
		user: User,
		{ originalUrl, expiryDate }: CreateShortUrlDto,
	): Promise<Pick<ShortUrl, 'user_id' | 'original_url' | 'expires_at' | 'short_code'>> {
		const urlCode = await this.generateUniqueCode();
		const shortUrl = {
			user_id: user.id,
			original_url: originalUrl,
			expires_at: expiryDate,
			short_code: urlCode,
		};
		const result = await this.shortUrlRepository.insert(shortUrl);
		if (!result) {
			throw new TypeORMError(errorMessage.urlCreationFailure);
		}
		this.logger.log(`${user.email} created a new short URL. Code ${shortUrl.short_code}`);
		return shortUrl;
	}

	private async findByCode(urlCode: string): Promise<ShortUrl | null> {
		const existingUrl = await this.shortUrlRepository.findOneBy({ short_code: urlCode });
		return existingUrl;
	}

	async findAllUrls(user: User, includeExpired: boolean = false): Promise<ShortUrl[]> {
		return await this.shortUrlRepository.find({
			where: { user_id: user.id, expires_at: includeExpired ? undefined : MoreThan(new Date()) },
		});
	}

	private async generateUniqueCode(retryCount = 0): Promise<string> {
		if (retryCount >= 10) {
			throw new Error(errorMessage.shortCodeGenerationFailed);
		}
		const code = generateUrlCode();
		const existingUrl = await this.findByCode(code);
		if (existingUrl) {
			this.logger.warn(`${code} already exists. Attempt ${retryCount + 1} out of 10`);
			return this.generateUniqueCode(retryCount + 1);
		}
		return code;
	}

	async redirectToOriginal(
		shortCode: string,
		shortURL: string,
		analyticsPayload: { userAgent: string; ipAddress: string },
	): Promise<TemplateResponse> {
		const urlData = await this.shortUrlRepository.findOne({
			where: { short_code: shortCode },
			withDeleted: true,
			relations: ['user'],
		});
		const templateData = {
			statusCode: HttpStatus.OK,
			data: '',
		};
		if (!urlData) {
			templateData.statusCode = HttpStatus.NOT_FOUND;
			templateData.data = await this.template.pageNotFoundTemp();
			return templateData;
		}
		const { id, original_url, user, expires_at } = urlData;

		await this.analyticsService.createAnalytics({ userId: user.id, shortUrlId: id, ...analyticsPayload });

		if (new Date() > expires_at) {
			templateData.data = await this.template.expiredTemplate();
			return templateData;
		}
		const url = original_url.includes('https') ? original_url : `https://${original_url}`;
		templateData.data = await this.template.redirectionHTMLTemplate(url);
		return templateData;
	}

	async updateExpiryDateByCode(
		id: string,
		{ expiryDate }: UpdateShortUrlDto,
		userId: string,
	): Promise<Partial<ShortUrl>> {
		const urlData = await this.shortUrlRepository.findOneBy({ id });
		if (!urlData) {
			throw new NotFoundException(errorMessage.urlNotFound);
		}
		if (urlData.user_id != userId) {
			throw new UnauthorizedException(errorMessage.unauthorized);
		}
		const updatedResult = (await this.shortUrlRepository.update({ id }, { expires_at: expiryDate })).affected;
		if (!updatedResult) throw new TypeORMError(errorMessage.urlNotUpdated);
		this.logger.log(`${successMessage.urlExpiryUpdated} => ${urlData.short_code}`);
		return {
			short_code: urlData.short_code,
			expires_at: new Date(expiryDate),
		};
	}

	async checkURLExpiry(): Promise<void> {
		const currentDate = new Date();
		const expiredUrls = await this.shortUrlRepository.find({
			where: { expires_at: LessThan(currentDate) },
			relations: ['user'],
		});
		if (expiredUrls.length == 0) {
			this.logger.log(successMessage.noExpiredUrls);
		}
		const resolveBulkQueue = [];
		for (const url of expiredUrls) {
			resolveBulkQueue.push(
				await this.queueService.add(
					'notifyExpiredUrl',
					{
						id: url.id,
						email: url.user.email,
						user_id: url.user_id,
						shortCode: url.short_code,
						name: url.user.name,
					},
					{ removeOnComplete: true, delay: 2000, attempts: 5, jobId: `notifyExpiredUrl-${url.id}` },
				),
			);
		}

		await Promise.all(resolveBulkQueue);
	}

	async deleteUrls(id: string, userId: string): Promise<UpdateResult> {
		const urlData = await this.shortUrlRepository.findOneBy({ id });
		if (!urlData) {
			throw new NotFoundException(errorMessage.urlNotFound);
		}
		if (urlData.user_id != userId) {
			throw new UnauthorizedException(errorMessage.unauthorized);
		}
		const deletionResult = await this.shortUrlRepository.softDelete({ id });
		this.logger.log(`${successMessage.deleteUrl} ${id}`);
		return deletionResult;
	}
}
