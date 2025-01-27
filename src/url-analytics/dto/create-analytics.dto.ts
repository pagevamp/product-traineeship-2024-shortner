import { IsString } from 'class-validator';

export class CreateUrlAnalyticsDto {
	@IsString()
	shortUrlId: string;

	@IsString()
	userId: string;

	@IsString()
	ipAddress: string;

	@IsString()
	userAgent: string;

	@IsString()
	shortURL: string;
}
