import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { Logger, VersioningType } from '@nestjs/common';
import { env } from '@/config/env.config';
import { ValidationPipe, RequestMethod } from '@nestjs/common';
import { redisClient } from '@/config/redis.config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap(): Promise<void> {
	const logger = new Logger();
	const port = env.APP_PORT;
	try {
		const app = await NestFactory.create<NestExpressApplication>(AppModule);
		app.set('trust proxy', true);
		app.enableCors();
		app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
		app.useGlobalPipes(new ValidationPipe());
		await redisClient.connect();
		logger.log('Connected to Redis');

		app.setGlobalPrefix('api', {
			exclude: [{ path: ':shortCode', method: RequestMethod.GET }],
		});
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
