import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);

	await app.listen(process.env.APP_PORT ?? 3000, () => {
		console.info('Listening to server....');
		console.info(`Server listening at port http://localhost:${process.env.APP_PORT}`);
	});
}

bootstrap();
