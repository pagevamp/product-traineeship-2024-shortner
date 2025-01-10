import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from '@/config/logger.config';
import { Logger, VersioningType } from '@nestjs/common';
import { env } from '@/config/env.config';
import { ValidationPipe } from '@nestjs/common';
import { redisClient } from '@/config/redis.config';

async function bootstrap(): Promise<void> {
	const logger = new Logger();
	const port = env.APP_PORT;
	try {
		const app = await NestFactory.create(AppModule, {
			logger: WinstonModule.createLogger(loggerConfig),
		});
		app.useGlobalPipes(new ValidationPipe());
		await redisClient.connect();
		logger.log('Connected to Redis');

		app.setGlobalPrefix('api');
		app.enableVersioning({
			type: VersioningType.URI,
			defaultVersion: '1',
		});

		await app.listen(port, () => {
			logger.log(`App is listening on port ${port}`);
		});
	} catch (error) {
		logger.error(error);
	}
}

bootstrap();
