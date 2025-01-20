import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { validate } from '@/config/env.config';
import { DatabaseModule } from '@/database/db.module';
import { AuthModule } from '@/auth/auth.module';
import { RateLimitMiddlewareFactory } from '@/middleware/reateLimit.middleware';
import { urlRateLimiter } from '@/config/rateLimit.config';
import { VerificationModule } from '@/verification/verification.module';
import { UsersModule } from '@/users/users.module';
import { AllExceptionsFilter } from '@/core/all-exceptions.filter';
import { MailerModule } from '@/mailer/mailer.module';
import { LoggerModule } from '@/logger/logger.module';
import { ShortUrlsModule } from '@/short-urls/short-urls.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from '@/cron/cron.module';
@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, validate }),
		ScheduleModule.forRoot(),
		DatabaseModule,
		UsersModule,
		VerificationModule,
		AuthModule,
		MailerModule,
		ShortUrlsModule,
		LoggerModule,
		ShortUrlsModule,
		CronModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		},
	],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(RateLimitMiddlewareFactory.create(urlRateLimiter)).forRoutes(AppController);
	}
}
