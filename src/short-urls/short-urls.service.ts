import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateShortUrlDto } from '@/short-urls/dto/create-short-url.dto';
import { SuccessResponse } from '@/common/response.interface';
import { errorMessage, successMessage } from '@/common/messages';
import { ShortUrl } from '@/short-urls/entities/short-url.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TypeORMError } from 'typeorm';
import { generateUrlCode } from '@/short-urls/util/generate-url-code';
import { User } from '@/users/entities/user.entity';
import { LoggerService } from '@/logger/logger.service';
@Injectable()
export class ShortUrlsService {
	constructor(
		private readonly logger: LoggerService,
		@InjectRepository(ShortUrl)
		private shortUrlRepository: Repository<ShortUrl>,
	) {}
	async createShortUrl(user: User, { originalUrl, expiaryDate }: CreateShortUrlDto): Promise<SuccessResponse> {
		let urlCode = generateUrlCode();
		const existingUrlCode = await this.findByCode(urlCode);
		if (existingUrlCode?.short_code === urlCode) {
			this.logger.warn(`${urlCode} already exists. Generating new code`);
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
		this.logger.log(`${user.name} created a new short URL`);
		return {
			status: HttpStatus.CREATED,
			message: successMessage.shortUrlCreated,
		};
	}

	async findByCode(urlCode: string): Promise<ShortUrl | null> {
		const existingUrl = await this.shortUrlRepository.findOneBy({ short_code: urlCode });
		return existingUrl;
	}
}
