import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { VerifyUserDto } from '@/users/dto/verify-user.dto';
import { SuccessResponse } from '@/common/response.interface';
import { SendVerificationDto } from '@/users/dto/send-verification.dto';
import { successMessage } from '@/common/messages';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}
	@Post('signup')
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() createUserDto: CreateUserDto): Promise<SuccessResponse> {
		await this.usersService.create(createUserDto);
		return {
			status: HttpStatus.CREATED,
			message: successMessage.userCreated,
		};
	}

	@Post('send-verification')
	@HttpCode(HttpStatus.OK)
	async emailVerification(@Body() sendVerificationDto: SendVerificationDto): Promise<SuccessResponse> {
		await this.usersService.sendEmailVerification(sendVerificationDto);
		return {
			status: HttpStatus.CREATED,
			message: successMessage.verificationEmailSent,
		};
	}

	@Post('verify')
	@HttpCode(HttpStatus.OK)
	async verifyEmail(@Body() verifyUserDto: VerifyUserDto): Promise<SuccessResponse> {
		await this.usersService.verifyEmail(verifyUserDto);
		return {
			status: HttpStatus.OK,
			message: successMessage.userVerified,
		};
	}
}
