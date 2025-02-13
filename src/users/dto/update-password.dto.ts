import { errorMessage } from '@/common/messages';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePasswordDto {
	@IsString()
	@IsNotEmpty()
	currentPassword: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(5, { message: errorMessage.minTwoLengthValidation })
	@MaxLength(15, { message: errorMessage.maxLengthValidation })
	newPassword: string;
}
