import { errorMessage } from '@/common/messages';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	@MinLength(5, { message: errorMessage.minLengthValidation })
	@MaxLength(15, { message: errorMessage.maxLengthValidation })
	password: string;
}
