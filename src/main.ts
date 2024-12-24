import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envVariables } from './config/env.config';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);
	const port = envVariables.APP_PORT ?? 3000;
	await app.listen(port, () => {
		console.info(`Server listening at port ${port}`);
	});
}

bootstrap();
