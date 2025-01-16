import { HTMLTemplateForRedirection } from '@/template/redirect.template';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShortUrl } from '@/short-urls/entities/short-url.entity';
import { Repository } from 'typeorm';
import { TemplateResponse } from '@/common/response.interface';

@Injectable()
export class ShortUrlsService {
	constructor(
		@InjectRepository(ShortUrl)
		private shortUrlRepository: Repository<ShortUrl>,
	) {}
	private readonly template = new HTMLTemplateForRedirection();
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
