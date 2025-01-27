import { AuthGuard } from '@/auth/guard/auth.guard';
import { User } from '@/users/entities/user.entity';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UrlAnalyticsService } from '@/url-analytics/url-analytics.service';
import { UrlAnalytics } from '@/url-analytics/entities/url-analytics.entity';

@Controller('reports')
export class UrlAnalyticsController {
	constructor(private readonly analyticsService: UrlAnalyticsService) {}
	@UseGuards(AuthGuard)
	@Get()
	async generateReportForUser(@Req() req: Request): Promise<UrlAnalytics[]> {
		const { id } = req.user as User;
		const reports = await this.analyticsService.getUserSpecificAnalysis(id);
		return reports;
	}
}
