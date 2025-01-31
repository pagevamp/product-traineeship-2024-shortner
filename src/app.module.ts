import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { validate } from '@/config/env.config';
import { DatabaseModule } from '@/database/db.module';
import { AuthModule } from '@/auth/auth.module';
import { VerificationModule } from '@/verification/verification.module';
import { UsersModule } from '@/users/users.module';
import { AllExceptionsFilter } from '@/core/all-exceptions.filter';
import { MailerModule } from '@/mailer/mailer.module';
import { ShortUrlsModule } from '@/short-urls/short-urls.module';
import { LoggerModule } from '@/logger/logger.module';
import { HealthModule } from '@/health/health.module';
import { RateLimitMiddlewareFactory } from '@/middleware/rate-limit.middleware';
import { testLimit } from '@/config/rateLimit.config';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, validate }),
		DatabaseModule,
		UsersModule,
		VerificationModule,
		AuthModule,
		MailerModule,
		ShortUrlsModule,
		LoggerModule,
		HealthModule,
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
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(RateLimitMiddlewareFactory.create(testLimit)).forRoutes('/');
	}
}
