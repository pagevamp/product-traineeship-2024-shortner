import { HTMLTemplateForRedirection } from '@/template/redirect.template';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateShortUrlDto } from '@/short-urls/dto/create-short-url.dto';
import { SuccessResponse } from '@/common/response.interface';
import { errorMessage, successMessage } from '@/common/messages';
import { ShortUrl } from '@/short-urls/entities/short-url.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TypeORMError } from 'typeorm';
import { generateUrlCode } from '@/short-urls/util/generate-url-code';
import { TemplateResponse } from '@/common/response.interface';
import { User } from '@/users/entities/user.entity';
@Injectable()
export class ShortUrlsService {
	constructor(
		@InjectRepository(ShortUrl)
		private shortUrlRepository: Repository<ShortUrl>,
	) {}
	private readonly template = new HTMLTemplateForRedirection();
	async createShortUrl(user: User, { originalUrl, expiaryDate }: CreateShortUrlDto): Promise<SuccessResponse> {
		let urlCode = generateUrlCode();
		const existingUrlCode = await this.findByCode(urlCode);
		if (existingUrlCode?.short_code === urlCode) {
			urlCode = generateUrlCode();
		}
		const shortUrl = {
			user_id: user.id,
			original_url: originalUrl,
			expiary_date: expiaryDate,
			short_code: urlCode,
		};
		const result = await this.shortUrlRepository.insert(shortUrl);
		if (!result) {
			throw new TypeORMError(errorMessage.urlCreationFailure);
		}
		return {
			status: HttpStatus.CREATED,
			message: successMessage.shortUrlCreated,
		};
	}

	async findByCode(urlCode: string): Promise<ShortUrl | null> {
		const existingUrl = await this.shortUrlRepository.findOneBy({ short_code: urlCode });
		return existingUrl;
	}
	async redirectToOriginal(shortCode: string, shortURL: string): Promise<TemplateResponse> {
		const urlData = await this.shortUrlRepository.findOneBy({ short_code: shortCode });
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
}
