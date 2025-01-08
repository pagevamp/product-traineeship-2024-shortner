import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from '@/config/logger.config';
import { Logger } from '@nestjs/common';
import { env } from '@/config/env.config';
import { ValidationPipe } from '@nestjs/common';
import { redisClient } from '@/config/redis.config';

async function bootstrap(): Promise<void> {
	const logger = new Logger();
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	const port = env.APP_PORT;
	try {
		const app = await NestFactory.create(AppModule, {
			logger: WinstonModule.createLogger(loggerConfig),
		});

		await redisClient.connect();
		logger.log('Connected to Redis');

		await app.listen(port, () => {
			logger.log(`App is listening on port ${port}`);
		});
	} catch (error) {
		logger.error(error);
	}
}

bootstrap();
