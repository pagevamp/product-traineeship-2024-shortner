import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';

@Controller('/api/users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}
	@Post('/signup')
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() createUserDto: CreateUserDto): Promise<object | undefined> {
		return await this.usersService.create(createUserDto);
	}
}
