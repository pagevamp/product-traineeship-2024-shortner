import { errorMessage } from '@/common/messages';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(5, { message: errorMessage.minFiveLengthValidation })
	@MaxLength(15, { message: errorMessage.maxLengthValidation })
	password: string;

	@IsString()
	@IsNotEmpty()
	name: string;
}
