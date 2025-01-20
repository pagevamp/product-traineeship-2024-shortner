import { HTMLTemplateForRedirection } from '@/template/redirect.template';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateShortUrlDto } from '@/short-urls/dto/create-short-url.dto';
import { errorMessage, successMessage } from '@/common/messages';
import { ShortUrl } from '@/short-urls/entities/short-url.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository, TypeORMError, UpdateResult } from 'typeorm';
import { generateUrlCode } from '@/short-urls/util/generate-url-code';
import { TemplateResponse } from '@/common/response.interface';
import { User } from '@/users/entities/user.entity';
import { LoggerService } from '@/logger/logger.service';
import { UsersService } from '@/users/users.service';

@Injectable()
export class ShortUrlsService {
	constructor(
		private readonly logger: LoggerService,
		private readonly userService: UsersService,
		@InjectRepository(ShortUrl)
		private shortUrlRepository: Repository<ShortUrl>,
	) {}
	private readonly template = new HTMLTemplateForRedirection();
	async createShortUrl(user: User, { originalUrl, expiryDate }: CreateShortUrlDto): Promise<Partial<ShortUrl>> {
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
		this.logger.log(`${user.name} created a new short URL`);
		return shortUrl;
	}

	async findByCode(urlCode: string): Promise<ShortUrl | null> {
		const existingUrl = await this.shortUrlRepository.findOneBy({ short_code: urlCode });
		return existingUrl;
	}
	async redirectToOriginal(shortCode: string, shortURL: string): Promise<TemplateResponse> {
		const urlData = await this.shortUrlRepository.findOne({
			where: { short_code: shortCode },
			relations: ['user'],
		});
		if (!urlData) {
			return {
				status: HttpStatus.NOT_FOUND,
				data: await this.template.pageNotFoundTemp(),
			};
		}
		const { original_url, user, expires_at } = urlData;
		if (new Date() > expires_at) {
			return {
				status: HttpStatus.OK,
				data: await this.template.expiredTemplate(shortURL, user.name),
			};
		}
		const url = original_url.includes('https') ? original_url : `https://${original_url}`;
		return {
			status: HttpStatus.OK,
			data: await this.template.redirectionHTMLTemplate(url, user.name),
		};
	}

	private async generateUniqueCode(retryCount = 0): Promise<string> {
		if (retryCount >= 10) {
			throw new Error(errorMessage.shortCodeGenerationFailed);
		}
		const code = generateUrlCode();
		const existingUrl = await this.findByCode(code);
		if (existingUrl) {
			this.logger.warn(`${code} already exists. Attempt ${retryCount + 1}/10`);
			return this.generateUniqueCode(retryCount + 1);
		}
		return code;
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
		for (const url of expiredUrls) {
			await this.deleteUrls(url.id);
			this.logger.log(`${url.short_code} is expired and hence deleted`);
		}
	}

	async deleteUrls(id: string): Promise<UpdateResult> {
		return await this.shortUrlRepository.softDelete({ id });
	}
}
