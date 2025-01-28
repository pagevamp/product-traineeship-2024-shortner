import { IsIP, IsString, IsUUID } from 'class-validator';

export class CreateUrlAnalyticsDto {
	@IsUUID()
	shortUrlId: string;
	@IsUUID()
	userId: string;
	@IsIP()
	ipAddress: string;
	@IsString()
	userAgent: string;
}
