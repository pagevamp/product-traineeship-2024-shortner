import { IsOptional, IsString } from 'class-validator';

export class AnalyticsQueryDto {
	@IsString()
	@IsOptional()
	from: string;

	@IsString()
	@IsOptional()
	to: string;

	@IsString()
	@IsOptional()
	browser: string;

	@IsString()
	@IsOptional()
	device: string;

	@IsString()
	@IsOptional()
	os: string;

	@IsString()
	@IsOptional()
	country: string;

	@IsString()
	@IsOptional()
	groupBy: string;

	@IsString()
	@IsOptional()
	clicked_at: string;
}
