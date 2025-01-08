import { HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { env } from '@/config/env.config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { SuccessResponse } from '@/common/response.interface';
import { errorMessage, successMessage } from '@/common/messages';
@Injectable()
export class UsersService {
	private readonly logger = new Logger();
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}
	async create(createUserDto: CreateUserDto): Promise<SuccessResponse | undefined> {
		try {
			const passwordHash = await hash(createUserDto.password, env.SALT_ROUND);
			const user = { ...createUserDto, password_hash: passwordHash };
			const createdUser = (await this.userRepository.insert(user)).generatedMaps[0];
			if (createdUser) {
				this.logger.log(` New user ${createUserDto.name}  created`);
				return {
					status: HttpStatus.CREATED,
					message: successMessage.userCreated,
				};
			}
		} catch (error) {
			this.logger.error(error);
		}
	}

	async findByEmail(email: string): Promise<User> {
		const user = await this.userRepository.findOneBy({ email });
		if (!user) {
			throw new NotFoundException(errorMessage.notFound);
		}
		return user;
	}
}
