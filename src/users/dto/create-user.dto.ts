import { error_message } from '@/common/messages';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(5, { message: error_message.password_length })
	password: string;

	@IsString()
	@IsNotEmpty()
	name: string;
}
