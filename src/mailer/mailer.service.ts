import { createTransport, SendMailOptions, Transporter } from 'nodemailer';
import { Logger } from '@nestjs/common';
import { MailerDto } from '@/mailer/dto/mailer.dto';
import { env } from '@/config/env.config';

export class MailerService {
	private readonly logger = new Logger();
	transporter: Transporter = createTransport({
		host: env.EMAIL_HOST,
		port: env.EMAIL_PORT,
		secure: true,

		auth: {
			user: env.EMAIL_USER,
			pass: env.EMAIL_PASS,
		},
	});

	async sendEmail(data: MailerDto): Promise<void> {
		try {
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
			this.logger.log('Mail sent successfully');
		} catch (error) {
			this.logger.error(`Failed to send email: ${error}`);
		}
	}
}
