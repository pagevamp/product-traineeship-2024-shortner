import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { AuthController } from '@/auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { env } from '@/config/env.config';
import { UsersModule } from '@/users/users.module';
import { RateLimitMiddlewareFactory } from '@/middleware/rate-limit.middleware';
import { authRateLimiter } from '@/config/rateLimit.config';

@Module({
	imports: [
		UsersModule,
		JwtModule.register({
			global: true,
			secret: env.JWT_SECRET,
			signOptions: { expiresIn: `${env.JWT_EXPIRATION}` },
		}),
	],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer
			.apply(RateLimitMiddlewareFactory.create(authRateLimiter))
			.forRoutes({ path: '/auth/login/', method: RequestMethod.POST, version: '1' });
	}
}
