import { Address } from 'nodemailer/lib/mailer';
export class MailerDto {
	sender?: Address;
	recipients: Address[];
	subject: string;
	html: string;
	text?: string;
}
