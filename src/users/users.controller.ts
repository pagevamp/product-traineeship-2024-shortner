import {
	Controller,
	Post,
	Body,
	HttpCode,
	HttpStatus,
	Patch,
	UseGuards,
	Param,
	Req,
	ForbiddenException,
	Get,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '@/users/users.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { VerifyUserDto } from '@/users/dto/verify-user.dto';
import { SuccessResponse } from '@/common/response.interface';
import { SendVerificationDto } from '@/users/dto/send-verification.dto';
import { errorMessage, successMessage } from '@/common/messages';
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

	@Patch(':id/profile')
	@UseGuards(AuthGuard)
	async updateProfile(
		@Param('id') id: string,
		@Body() updateUserDto: UpdateUserDto,
		@Req() req: Request,
	): Promise<SuccessResponse> {
		const user = req.user as User;
		if (user.id !== id) {
			throw new ForbiddenException(errorMessage.unauthorized);
		}
		await this.usersService.updateProfile(id, updateUserDto);
		return {
			status: HttpStatus.OK,
			message: successMessage.userUpdateSuccess,
		};
	}

	@Get(':id/profile')
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	async getUserDetails(@Param('id') id: string, @Req() req: Request): Promise<User> {
		const user = req.user as User;
		if (user.id !== id) {
			throw new ForbiddenException(errorMessage.unauthorized);
		}
		return await this.usersService.findById(user.id);
	}

	@Patch(':id/password')
	@UseGuards(AuthGuard)
	async updatePassword(
		@Param('id') id: string,
		@Body() updatePasswordDto: UpdatePasswordDto,
		@Req() req: Request,
	): Promise<SuccessResponse> {
		const user = req.user as User;
		const email = user.email;
		if (user.id !== id) {
			throw new ForbiddenException(errorMessage.unauthorized);
		}
		await this.usersService.updatePassword(email, updatePasswordDto);
		return {
			status: HttpStatus.OK,
			message: successMessage.userPasswordUpdateSuccess,
		};
	}
}
