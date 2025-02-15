import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString, MaxDate, Validate } from 'class-validator';
import { FilterDate } from '@/url-analytics/validator/filter-date.validator';

enum GroupByAndSortBy {
	operating_system = 'operating_system',
	device = 'device',
	browser = 'browser',
	clicked_at = 'clicked_at',
}
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

	@IsEnum(GroupByAndSortBy, { each: true })
	@IsOptional()
	@Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
	groupBy: string;

	@IsDate()
	@IsOptional()
	@Transform(({ value }) => new Date(value), { toClassOnly: true })
	clickedAt: Date;

	@IsString()
	@IsOptional()
	urlId: string;

	@IsOptional()
	page?: number;

	@IsOptional()
	limit?: number;

	@IsEnum(GroupByAndSortBy)
	@IsOptional()
	sortBy?: string;

	order?: 'ASC' | 'DESC';
}
