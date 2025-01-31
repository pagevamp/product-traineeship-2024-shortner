import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { env, validate } from '@/config/env.config';
import { DatabaseModule } from '@/database/db.module';
import { AuthModule } from '@/auth/auth.module';
import { VerificationModule } from '@/verification/verification.module';
import { UsersModule } from '@/users/users.module';
import { AllExceptionsFilter } from '@/core/all-exceptions.filter';
import { MailerModule } from '@/mailer/mailer.module';
import { LoggerModule } from '@/logger/logger.module';
import { HealthModule } from '@/health/health.module';
import { ShortUrlsModule } from '@/short-urls/short-urls.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from '@/cron/cron.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, validate }),
		ScheduleModule.forRoot(),
		BullModule.forRoot({
			connection: {
				host: env.REDIS_HOST,
				port: env.REDIS_PORT,
			},
		}),
		DatabaseModule,
		UsersModule,
		VerificationModule,
		AuthModule,
		MailerModule,
		ShortUrlsModule,
		LoggerModule,
		CronModule,
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
export class AppModule {}
