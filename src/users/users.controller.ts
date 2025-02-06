import { Controller, Post, Body, HttpCode, HttpStatus, Patch, UseGuards, Req, Get } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '@/users/users.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { VerifyUserDto } from '@/users/dto/verify-user.dto';
import { SuccessResponse } from '@/common/response.interface';
import { SendVerificationDto } from '@/users/dto/send-verification.dto';
import { successMessage } from '@/common/messages';
import { AuthGuard } from '@/auth/guard/auth.guard';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { User } from '@/users/entities/user.entity';
import { UpdatePasswordDto } from '@/users/dto/update-password.dto';

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

	@Patch('profile')
	@UseGuards(AuthGuard)
	async updateProfile(@Body() updateUserDto: UpdateUserDto, @Req() req: Request): Promise<SuccessResponse> {
		const user = req.user as User;
		await this.usersService.updateProfile(user.id, updateUserDto);
		return {
			status: HttpStatus.OK,
			message: successMessage.userUpdateSuccess,
		};
	}

	@Get('profile')
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	async getUserDetails(@Req() req: Request): Promise<User> {
		const user = req.user as User;
		return await this.usersService.findById(user.id, true);
	}

	@Patch('password')
	@UseGuards(AuthGuard)
	async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto, @Req() req: Request): Promise<SuccessResponse> {
		const user = req.user as User;
		await this.usersService.updatePassword(user.id, updatePasswordDto);
		return {
			status: HttpStatus.OK,
			message: successMessage.userPasswordUpdateSuccess,
		};
	}
}
