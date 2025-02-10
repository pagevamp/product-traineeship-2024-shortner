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
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ShortUrlsService } from '@/short-urls/short-urls.service';
import { CreateShortUrlDto } from '@/short-urls/dto/create-short-url.dto';
import { GetMethodResponse, SuccessResponse } from '@/common/response.interface';
import { AuthGuard } from '@/auth/guard/auth.guard';
import { User } from '@/users/entities/user.entity';
import { successMessage } from '@/common/messages';
import { Avoid } from '@/decorator/avoid-guard.decorator';
import { UpdateResult } from 'typeorm';
import { ShortUrl } from '@/short-urls/entities/short-url.entity';
import { UpdateShortUrlDto } from '@/short-urls/dto/update-short-url.dto';

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
		const analyticsPayload = {
			userAgent: req.headers['user-agent'] as string,
			ipAddress: req.ip as string,
		};
		const template = await this.shortUrlsService.redirectToOriginal(shortCode, shortURL, analyticsPayload);
		res.setHeader('Content-Type', 'text/html');
		res.status(template.statusCode).send(template.data);
	}

	@Patch('urls')
	async updateURLexpiry(
		@Query('shortCode') shortCode: string,
		@Body() body: UpdateShortUrlDto,
	): Promise<GetMethodResponse> {
		const newExpiryDate = body.expiryDate;
		const updatedData = await this.shortUrlsService.updateExpiryDateByCode(shortCode, newExpiryDate);
		return { status: HttpStatus.OK, message: successMessage.urlExpiryUpdated, data: updatedData };
	}
	@Delete('urls')
	async delete(@Param('id') id: string): Promise<UpdateResult> {
		return await this.shortUrlsService.deleteUrls(id);
	}
}
