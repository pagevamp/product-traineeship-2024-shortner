import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Param,
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
@UseGuards(AuthGuard)
@Controller('urls')
export class ShortUrlsController {
	constructor(private readonly shortUrlsService: ShortUrlsService) {}
	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Req() req: Request, @Body() createShortUrlDto: CreateShortUrlDto): Promise<SuccessResponse> {
		const user = req.user as User;
		return await this.shortUrlsService.createShortUrl(user, createShortUrlDto);
	}

	@Get(':shortCode')
	@Version(VERSION_NEUTRAL)
	async redirect(@Param('shortCode') shortCode: string, @Res() res: Response, @Req() req: Request): Promise<void> {
		if (req.params.shortCode === 'favicon.ico') res.status(204).end();
		const shortURL = `${req.headers.host}/${shortCode}`;
		const template = await this.shortUrlsService.redirectToOriginal(shortCode, shortURL);
		res.setHeader('Content-Type', 'text/html');
		res.status(template.status).send(template.data);
	}
}
