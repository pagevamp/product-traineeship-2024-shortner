import { Module } from '@nestjs/common';
import { UrlAnalyticsService } from '@/url-analytics/url-analytics.service';
import { UrlAnalyticsController } from '@/url-analytics/url-analytics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlAnalytics } from '@/url-analytics/entities/url-analytics.entity';
import { UsersModule } from '@/users/users.module';

@Module({
	imports: [TypeOrmModule.forFeature([UrlAnalytics]), UsersModule],
	providers: [UrlAnalyticsService],
	controllers: [UrlAnalyticsController],
	exports: [UrlAnalyticsService],
})
export class UrlAnalyticsModule {}
