import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(32)
	password: string;

	@IsString()
	@IsNotEmpty()
	name: string;
}
