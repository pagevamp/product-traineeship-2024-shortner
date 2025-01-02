import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { env } from '@/config/env.config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SuccessResponse } from '@/common/response.interface';
import { success_message } from '@/common/messages';
@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private userModel: Repository<User>,
	) {}
	async create(createUserDto: CreateUserDto): Promise<SuccessResponse | undefined> {
		try {
			const passwordHash = await bcrypt.hash(createUserDto.password, env.SALT_ROUND);
			const user = { ...createUserDto, password_hash: passwordHash };
			const isCreated = await this.userModel.insert(user);
			if (isCreated) {
				return {
					status: HttpStatus.CREATED,
					message: success_message.user_created,
				};
			}
		} catch (error) {
			throw new Error(error);
		}
	}
}
