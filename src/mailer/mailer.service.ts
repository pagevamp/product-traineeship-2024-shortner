import { createTransport, SendMailOptions, Transporter } from 'nodemailer';
import { Logger } from '@nestjs/common';
import { MailerDto } from '@/mailer/dto/mailer.dto';

export class MailerService {
	private readonly logger = new Logger();
	transporter: Transporter = createTransport({
		host: process.env.EMAIL_HOST,
		port: 465,
		secure: true,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	async sendEmail(data: MailerDto): Promise<void> {
		try {
			const { to, subject, html, text } = data;
			const mailOptions: SendMailOptions = {
				from: {
					name: process.env.EMAIL_SENDER_NAME as string,
					address: process.env.EMAIL_USER as string,
				},
				to,
				subject,
				html,
				text,
			};
			await this.transporter.sendMail(mailOptions);
			this.logger.log('Mail sent successfully');
		} catch (error) {
			this.logger.error(`Error sending mail: ${error}`);
		}
	}
}
