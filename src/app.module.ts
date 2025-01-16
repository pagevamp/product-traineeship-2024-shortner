import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
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
import { LoggerModule } from '@/logger/logger.module';
@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, validate }),
		DatabaseModule,
		UsersModule,
		VerificationModule,
		AuthModule,
		MailerModule,
		LoggerModule,
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
