import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);

	await app.listen(process.env.APP_PORT ?? 3000, () => {
		console.log('Listening to server....');
		console.log(`Server listening at port http://localhost:${process.env.APP_PORT}`);
	});
}

bootstrap();
