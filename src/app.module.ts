import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { validate } from '@/config/env.config';
import { DatabaseModule } from '@/database/db.module';
import { AuthModule } from './auth/auth.module';
import { RateLimitMiddlewareFactory } from './middleware/reateLimit.middleware';
import { urlRateLimiter } from './config/rateLimit.config';
import { UsersModule } from './users/users.module';

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true, validate }), DatabaseModule, UsersModule, AuthModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(RateLimitMiddlewareFactory.create(urlRateLimiter)).forRoutes(AppController);
	}
}
