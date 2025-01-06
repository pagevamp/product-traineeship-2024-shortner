import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class LoginDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	@MaxLength(10) //add length message here after PDT24-32 gets approved
	password: string;
}
