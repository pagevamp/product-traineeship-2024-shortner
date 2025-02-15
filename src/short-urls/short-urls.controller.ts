import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
	Req,
	Res,
	Version,
	VERSION_NEUTRAL,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ShortUrlsService } from '@/short-urls/short-urls.service';
import { CreateShortUrlDto } from '@/short-urls/dto/create-short-url.dto';
import { GetMethodResponse, SuccessResponse } from '@/common/response.interface';
import { AuthGuard } from '@/auth/guard/auth.guard';
import { User } from '@/users/entities/user.entity';
import { successMessage } from '@/common/messages';
import { Avoid } from '@/decorator/avoid-guard.decorator';
import { CustomShortURLInterceptor } from '@/short-urls/interceptor/url.interceptor';
import { UpdateShortUrlDto } from '@/short-urls/dto/update-short-url.dto';

@UseGuards(AuthGuard)
@Controller()
export class ShortUrlsController {
	constructor(private readonly shortUrlsService: ShortUrlsService) {}
	@Post('urls')
	@UseInterceptors(CustomShortURLInterceptor)
	@HttpCode(HttpStatus.CREATED)
	async create(@Req() req: Request, @Body() createShortUrlDto: CreateShortUrlDto): Promise<GetMethodResponse> {
		const user = req.user as User;
		const shortURL = await this.shortUrlsService.createShortUrl(user, createShortUrlDto);
		return {
			status: HttpStatus.CREATED,
			message: successMessage.shortUrlCreated,
			data: [shortURL],
		};
	}

	@Get('urls')
	@HttpCode(HttpStatus.OK)
	@UseInterceptors(CustomShortURLInterceptor)
	async findAll(
		@Req() req: Request,
		@Query('expired') expired?: string,
		@Query('search') search?: string,
	): Promise<Omit<GetMethodResponse, 'status' | 'message'>> {
		const user = req.user as User;
		const isExpired = expired === 'true';
		const urlData = await this.shortUrlsService.findAllUrls(user, isExpired, search);
		return {
			data: urlData,
		};
	}

	@Avoid()
	@Get('s/:shortCode')
	@Version(VERSION_NEUTRAL)
	async redirect(@Param('shortCode') shortCode: string, @Res() res: Response, @Req() req: Request): Promise<void> {
		if (req.params.shortCode === 'favicon.ico') res.status(204);
		const shortURL = `${req.headers.host}/${shortCode}`;
		const analyticsPayload = {
			userAgent: req.headers['user-agent'] as string,
			ipAddress: req.ip as string,
		};
		const template = await this.shortUrlsService.redirectToOriginal(shortCode, shortURL, analyticsPayload);
		res.setHeader('Content-Type', 'text/html');
		res.status(template.statusCode).send(template.data);
	}

	@Patch('urls/:id')
	async updateURLexpiry(
		@Param('id') id: string,
		@Body() body: UpdateShortUrlDto,
		@Req() req: Request,
	): Promise<GetMethodResponse> {
		const user = req.user as User;
		const updatedData = await this.shortUrlsService.updateExpiryDateByCode(id, body, user.id);
		return { status: HttpStatus.OK, message: successMessage.urlExpiryUpdated, data: updatedData };
	}

	@Delete('urls/:id')
	async delete(@Param('id') id: string, @Req() req: Request): Promise<SuccessResponse> {
		const user = req.user as User;
		await this.shortUrlsService.deleteUrls(id, user.id);
		return {
			status: HttpStatus.OK,
			message: successMessage.deleteUrl,
		};
	}
}
