import { Controller, Get, Param, Req, Res, Version, VERSION_NEUTRAL } from '@nestjs/common';
import { ShortUrlsService } from '@/short-urls/short-urls.service';
import { Request, Response } from 'express';
@Controller()
export class ShortUrlsController {
	constructor(private readonly shortUrlsService: ShortUrlsService) {}

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
