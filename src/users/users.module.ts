import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { UsersController } from '@/users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';
import { VerificationModule } from '@/verification/verification.module';
import { MailerModule } from '@/mailer/mailer.module';
import { RateLimitMiddlewareFactory } from '@/middleware/rate-limit.middleware';
import { authRateLimiter, otpVerificationRateLimiter } from '@/config/rateLimit.config';
import { BullModule } from '@nestjs/bullmq';
import { VerificationEmailConsumer } from '@/queue/send-verification-queue.consumer';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		VerificationModule,
		MailerModule,
		BullModule.registerQueue({ name: 'sendVerificationMail' }),
	],
	controllers: [UsersController],
	providers: [UsersService, VerificationEmailConsumer],
	exports: [UsersService],
})
export class UsersModule implements NestModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer
			.apply(RateLimitMiddlewareFactory.create(authRateLimiter))
			.forRoutes({ path: '/users/signup/', method: RequestMethod.POST, version: '1' });
		consumer
			.apply(RateLimitMiddlewareFactory.create(authRateLimiter))
			.forRoutes({ path: '/users/send-verification/', method: RequestMethod.POST, version: '1' });
		consumer
			.apply(RateLimitMiddlewareFactory.create(otpVerificationRateLimiter))
			.forRoutes({ path: '/users/verify/', method: RequestMethod.POST, version: '1' });
	}
}
