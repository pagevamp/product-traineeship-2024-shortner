import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString, MaxDate, Validate } from 'class-validator';
import { FilterDate } from '@/url-analytics/validator/filter-date.validator';

export class AnalyticsQueryDto {
	@IsDate()
	@IsOptional()
	@Transform(({ value }) => new Date(value), { toClassOnly: true })
	startDate: Date;

	@IsDate()
	@IsOptional()
	@Transform(({ value }) => new Date(value), { toClassOnly: true })
	@MaxDate(new Date())
	@Validate(FilterDate)
	endDate: Date;

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

	@IsDate()
	@IsOptional()
	@Transform(({ value }) => new Date(value), { toClassOnly: true })
	clickedAt: Date;

	@IsString()
	@IsOptional()
	urlId: string;
}
