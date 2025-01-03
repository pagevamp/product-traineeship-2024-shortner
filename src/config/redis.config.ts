import { createClient } from 'redis';
import { env } from '@/config/env.config';

export const redisClient = createClient({
	username: env.REDIS_USERNAME,
	password: env.REDIS_PASSWORD,
	socket: {
		host: env.REDIS_HOST,
		port: env.REDIS_PORT,
	},
});
