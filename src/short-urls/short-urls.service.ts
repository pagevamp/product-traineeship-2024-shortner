import { Injectable } from '@nestjs/common';
import { CreateShortUrlDto } from '@/short-urls/dto/create-short-url.dto';
import { errorMessage } from '@/common/messages';
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
}
