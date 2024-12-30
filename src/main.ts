import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from '@/config/logger.config';
import { Logger } from '@nestjs/common';
import { MailerService } from './mailer/mailer.service';
import { signupOtpMailTemplate } from './template/email.template';

async function bootstrap(): Promise<void> {
	const logger = new Logger();
	const port = process.env.APP_PORT ?? 3000;
	const app = await NestFactory.create(AppModule, {
		// this will overwrite the default logger of nestJS with custom winston logger
		logger: WinstonModule.createLogger(loggerConfig),
	});
	await app.listen(port, () => {
		logger.log(`App is listening on port ${port}`);
	});
	// only for testing purpose
	const mail = new MailerService();
	mail.sendEmail({
		subject: signupOtpMailTemplate.subject,
		recipients: [{ name: 'Mr.Robot', address: 'testuser@test.com' }],
		html: signupOtpMailTemplate.body(123456, 'Narayan'),
	});
}

bootstrap();
