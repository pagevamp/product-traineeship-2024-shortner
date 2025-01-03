import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from '@/config/logger.config';
import { Logger } from '@nestjs/common';
import { env } from '@/config/env.config';

async function bootstrap(): Promise<void> {
	const logger = new Logger();
	const port = env.APP_PORT;
	const app = await NestFactory.create(AppModule, {
		// this will overwrite the default logger of nestJS with custom winston logger
		logger: WinstonModule.createLogger(loggerConfig),
	});
	await app.listen(port, () => {
		logger.log(`App is listening on port ${port}`);
	});
}

bootstrap();
