import { createTransport, SendMailOptions, Transporter } from 'nodemailer';
import { MailerDto } from '@/mailer/dto/mailer.dto';
import { env } from '@/config/env.config';
import { LoggerService } from '@/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { successMessage } from '@/common/messages';
@Injectable()
export class MailerService {
	constructor(private logger: LoggerService) {}
	transporter: Transporter = createTransport({
		host: env.EMAIL_HOST,
		port: env.EMAIL_PORT,
		secure: false,
		auth: {
			user: env.EMAIL_USER,
			pass: env.EMAIL_PASS,
		},
	});

	async sendEmail(data: MailerDto): Promise<void> {
		const { to, subject, html, text } = data;
		const mailOptions: SendMailOptions = {
			from: {
				name: env.EMAIL_SENDER_NAME as string,
				address: env.EMAIL_USER as string,
			},
			to,
			subject,
			html,
			text,
		};
		await this.transporter.sendMail(mailOptions);
		this.logger.log(`${successMessage.mailSentSuccess}${to[0].address}`);
	}
}
