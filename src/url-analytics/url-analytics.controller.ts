import { AuthGuard } from '@/auth/guard/auth.guard';
import { User } from '@/users/entities/user.entity';
import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UrlAnalyticsService } from '@/url-analytics/url-analytics.service';
import { AnalyticsQueryDto } from '@/url-analytics/dto/query-analytics.dto';
import { QueryFilterInterface } from '@/common/response.interface';

@Controller('reports')
export class UrlAnalyticsController {
	constructor(private readonly analyticsService: UrlAnalyticsService) {}
	@UseGuards(AuthGuard)
	@Get()
	async generateReportForUser(@Query() query: AnalyticsQueryDto, @Req() req: Request): Promise<QueryFilterInterface> {
		const { id } = req.user as User;
		const reports = await this.analyticsService.getUserSpecificAnalysis(id, query);
		return reports;
	}
}
