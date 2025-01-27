import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Req,
	Res,
	UseGuards,
	Version,
	VERSION_NEUTRAL,
} from '@nestjs/common';
import { ShortUrlsService } from '@/short-urls/short-urls.service';
import { CreateShortUrlDto } from '@/short-urls/dto/create-short-url.dto';
import { SuccessResponse } from '@/common/response.interface';
import { AuthGuard } from '@/auth/guard/auth.guard';
import { User } from '@/users/entities/user.entity';
import { Request, Response } from 'express';
import { successMessage } from '@/common/messages';
import { Avoid } from '@/decorator/avoid-guard.decorator';
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

	@Avoid()
	@Get(':shortCode')
	@Version(VERSION_NEUTRAL)
	async redirect(@Param('shortCode') shortCode: string, @Res() res: Response, @Req() req: Request): Promise<void> {
		if (req.params.shortCode === 'favicon.ico') res.status(204);
		const shortURL = `${req.headers.host}/${shortCode}`;
		const analyticsPayload = {
			userAgent: req.headers['user-agent'] as string,
			ipAddress: (req.headers['x-forwarded-for'] || req.headers.forwarded || req.ip) as string,
		};
		const template = await this.shortUrlsService.redirectToOriginal(shortCode, shortURL, analyticsPayload);
		res.setHeader('Content-Type', 'text/html');
		res.status(template.status).send(template.data);
	}
}
