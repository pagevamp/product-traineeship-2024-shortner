import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { validate } from '@/config/env.config';
import { DatabaseModule } from '@/database/db.module';
import { RateLimitMiddlewareFactory } from './middleware/reateLimit.middleware';
import { urlRateLimiter } from './config/rateLimit.config';
import { UsersModule } from './users/users.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionHandler } from './common/HttpExceptionHandler';

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true, validate }), DatabaseModule, UsersModule],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_FILTER,
			useClass: HttpExceptionHandler,
		},
	],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(RateLimitMiddlewareFactory.create(urlRateLimiter)).forRoutes(AppController);
	}
}
