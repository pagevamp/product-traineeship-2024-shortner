import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyUserDto } from '@/users/dto/verify-user.dto';
import { SuccessResponse } from '@/common/response.interface';

@Controller('/api/users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}
	@Post('/signup')
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() createUserDto: CreateUserDto): Promise<object | undefined> {
		return await this.usersService.create(createUserDto);
	}

	@Post('send-verification')
	@HttpCode(HttpStatus.OK)
	async emailVerification(@Body() verifyUserDto: VerifyUserDto): Promise<boolean> {
		return await this.usersService.sendEmailVerification(verifyUserDto.email);
	}

	@Post('verify')
	@HttpCode(HttpStatus.OK)
	async verifyEmail(@Body() verifyUserDto: VerifyUserDto): Promise<SuccessResponse> {
		return await this.usersService.verifyEmail(verifyUserDto.email, verifyUserDto.otp);
	}
}
