import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { SuccessResponse } from '@/common/response.interface';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}
	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() createUserDto: CreateUserDto): Promise<SuccessResponse> {
		return await this.usersService.create(createUserDto);
	}
}
