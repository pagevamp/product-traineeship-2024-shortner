import { Address as EmailAddress } from 'nodemailer/lib/mailer';
export class MailerDto {
	to: EmailAddress[];
	subject: string;
	html: string;
	text?: string;
}
