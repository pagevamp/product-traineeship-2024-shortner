import { Module } from '@nestjs/common';
import { ShortUrlsService } from '@/short-urls/short-urls.service';
import { ShortUrlsController } from '@/short-urls/short-urls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortUrl } from '@/short-urls/entities/short-url.entity';
import { UsersModule } from '@/users/users.module';
import { UrlAnalyticsModule } from '@/url-analytics/url-analytics.module';
import { BullModule } from '@nestjs/bullmq';
import { ExpiryEmailConsumer } from '@/queue/queue.consumer';
import { MailerModule } from '@/mailer/mailer.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([ShortUrl]),
		UsersModule,
		BullModule.registerQueue({ name: 'notifyExpiredUrl' }),
		MailerModule,
		UrlAnalyticsModule,
	],
	controllers: [ShortUrlsController],
	providers: [ShortUrlsService, ExpiryEmailConsumer],
	exports: [ShortUrlsService],
})
export class ShortUrlsModule {}
