import { errorMessage } from '@/common/messages';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(5, { message: errorMessage.length_validation })
	password: string;

	@IsString()
	@IsNotEmpty()
	name: string;
}
