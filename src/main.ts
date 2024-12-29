import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { env } from '@/config/env.config';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);
	const port = env.APP_PORT;
	await app.listen(port, () => {
		console.info(`${env.NODE_ENV?.toLocaleUpperCase()} Server listening at port ${port}`);
	});
}

bootstrap();
