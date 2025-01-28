import { Controller } from '@nestjs/common';
import { UrlAnalyticsService } from '@/url-analytics/url-analytics.service';

@Controller('reports')
export class UrlAnalyticsController {
	constructor(private readonly analyticsService: UrlAnalyticsService) {}
}
