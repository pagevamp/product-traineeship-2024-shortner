import { Logger, Module } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { UsersController } from '@/users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	controllers: [UsersController],
	exports: [UsersService],
	providers: [UsersService, Logger],
})
export class UsersModule {}
