import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ShortUrlsService } from '@/short-urls/short-urls.service';
import { CreateShortUrlDto } from '@/short-urls/dto/create-short-url.dto';
import { SuccessResponse } from '@/common/response.interface';
import { AuthGuard } from '@/auth/guard/auth.guard';
import { User } from '@/users/entities/user.entity';
import { Request } from 'express';
import { successMessage } from '@/common/messages';
@UseGuards(AuthGuard)
@Controller('urls')
export class ShortUrlsController {
	constructor(private readonly shortUrlsService: ShortUrlsService) {}
	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Req() req: Request, @Body() createShortUrlDto: CreateShortUrlDto): Promise<SuccessResponse> {
		const user = req.user as User;
		await this.shortUrlsService.createShortUrl(user, createShortUrlDto);
		return {
			status: HttpStatus.CREATED,
			message: successMessage.shortUrlCreated,
		};
	}
}
