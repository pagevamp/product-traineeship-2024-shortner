/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redisClient } from '@/config/redis.config';
import { errorMessage } from '@/common/messages';

interface RateLimitConfig {
	windowMs: number;
	max: number;
	isGlobal?: boolean;
}

@Injectable()
export class RateLimitMiddlewareFactory {
	static create(config: RateLimitConfig): new () => NestMiddleware {
		@Injectable()
		class CustomRateLimit implements NestMiddleware {
			private limiter = rateLimit({
				windowMs: config.windowMs || 15 * 60 * 1000,
				max: config.max || 100,
				message: {
					status: 429,
					error: errorMessage.ipLimitExceedError,
					message: errorMessage.ipLimitExceedMessage,
				},
				standardHeaders: true,
				...(config.isGlobal ? { keyGenerator: () => `global-limit` } : {}),
				legacyHeaders: false,
				validate: { xForwardedForHeader: false },
				store: new RedisStore({
					sendCommand: (...args: string[]) => redisClient.sendCommand(args),
				}),
			});

			use(req: Request, res: Response, next: NextFunction) {
				this.limiter(req, res, next);
			}
		}
		return CustomRateLimit;
	}
}
