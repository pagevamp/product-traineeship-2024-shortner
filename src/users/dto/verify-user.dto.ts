import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyUserDto {
	@IsEmail()
	email: string;
	@IsNotEmpty()
	@IsString()
	otp: string;
}
