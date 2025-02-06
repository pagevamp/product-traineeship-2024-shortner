import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Param,
	Query,
	Req,
	Res,
	Version,
	VERSION_NEUTRAL,
	UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ShortUrlsService } from '@/short-urls/short-urls.service';
import { CreateShortUrlDto } from '@/short-urls/dto/create-short-url.dto';
import { SuccessResponse } from '@/common/response.interface';
import { AuthGuard } from '@/auth/guard/auth.guard';
import { User } from '@/users/entities/user.entity';
import { successMessage } from '@/common/messages';
import { Avoid } from '@/decorator/avoid-guard.decorator';
import { UpdateResult } from 'typeorm';
import { ShortUrl } from '@/short-urls/entities/short-url.entity';

@UseGuards(AuthGuard)
@Controller()
export class ShortUrlsController {
	constructor(private readonly shortUrlsService: ShortUrlsService) {}
	@Post('urls')
	@HttpCode(HttpStatus.CREATED)
	async create(@Req() req: Request, @Body() createShortUrlDto: CreateShortUrlDto): Promise<SuccessResponse> {
		const user = req.user as User;
		await this.shortUrlsService.createShortUrl(user, createShortUrlDto);
		return {
			status: HttpStatus.CREATED,
			message: successMessage.shortUrlCreated,
		};
	}

	@Get('urls')
	@HttpCode(HttpStatus.OK)
	async findAll(@Req() req: Request, @Query('expired') expired?: string): Promise<ShortUrl[]> {
		const user = req.user as User;
		const isExpired = expired === 'true';
		return await this.shortUrlsService.findAllUrls(user, isExpired);
	}

	@Avoid()
	@Get('s/:shortCode')
	@Version(VERSION_NEUTRAL)
	async redirect(@Param('shortCode') shortCode: string, @Res() res: Response, @Req() req: Request): Promise<void> {
		if (req.params.shortCode === 'favicon.ico') res.status(204);
		const shortURL = `${req.headers.host}/${shortCode}`;
		const template = await this.shortUrlsService.redirectToOriginal(shortCode, shortURL);
		res.setHeader('Content-Type', 'text/html');
		res.status(template.status).send(template.data);
	}

	@Delete('urls')
	async delete(@Param('id') id: string): Promise<UpdateResult> {
		return await this.shortUrlsService.deleteUrls(id);
	}
}
