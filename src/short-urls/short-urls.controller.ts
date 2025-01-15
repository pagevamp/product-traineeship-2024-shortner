import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ShortUrlsService } from '@/short-urls/short-urls.service';
import { CreateShortUrlDto } from '@/short-urls/dto/create-short-url.dto';
import { SuccessResponse } from '@/common/response.interface';

@Controller('urls')
export class ShortUrlsController {
	constructor(private readonly shortUrlsService: ShortUrlsService) {}
	@Post('create')
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() createShortUrlDto: CreateShortUrlDto): Promise<SuccessResponse> {
		return await this.shortUrlsService.createShortUrl(createShortUrlDto);
	}
}
