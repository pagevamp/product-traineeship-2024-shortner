import { Address } from 'nodemailer/lib/mailer';
export class MailerDto {
	to: Address[];
	subject: string;
	html: string;
	text?: string;
}
