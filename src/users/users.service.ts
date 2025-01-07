import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { env } from '@/config/env.config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { SuccessResponse } from '@/common/response.interface';
import { successMessage } from '@/common/messages';
@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}
	async create(createUserDto: CreateUserDto): Promise<SuccessResponse | undefined> {
		const logger = new Logger();
		try {
			const passwordHash = await hash(createUserDto.password, env.SALT_ROUND);
			const user = { ...createUserDto, password_hash: passwordHash };
			const createdUser = (await this.userRepository.insert(user)).generatedMaps[0];
			if (createdUser) {
				logger.log(` New user ${createUserDto.name}  created`);
				return {
					status: HttpStatus.CREATED,
					message: successMessage.user_created,
				};
			}
		} catch (error) {
			logger.error(error);
		}
	}
}
