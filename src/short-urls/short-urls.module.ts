import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ShortUrlsService } from '@/short-urls/short-urls.service';
import { ShortUrlsController } from '@/short-urls/short-urls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortUrl } from '@/short-urls/entities/short-url.entity';
import { UsersModule } from '@/users/users.module';
import { UrlAnalyticsModule } from '@/url-analytics/url-analytics.module';
import { BullModule } from '@nestjs/bullmq';
import { ExpiryEmailConsumer } from '@/queue/queue.consumer';
import { MailerModule } from '@/mailer/mailer.module';
import { RateLimitMiddlewareFactory } from '@/middleware/rate-limit.middleware';
import { urlRateLimiter } from '@/config/rateLimit.config';

@Module({
	imports: [
		TypeOrmModule.forFeature([ShortUrl]),
		UrlAnalyticsModule,
		UsersModule,
		BullModule.registerQueue({ name: 'notifyExpiredUrl' }),
		MailerModule,
	],
	controllers: [ShortUrlsController],
	providers: [ShortUrlsService, ExpiryEmailConsumer],
	exports: [ShortUrlsService],
})
export class ShortUrlsModule implements NestModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer
			.apply(RateLimitMiddlewareFactory.create(urlRateLimiter))
			.forRoutes({ path: '/s/:shortCode', method: RequestMethod.GET });
	}
}
