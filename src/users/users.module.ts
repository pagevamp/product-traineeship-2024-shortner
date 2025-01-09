import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { VerificationModule } from '@/verification/verification.module';
import { MailerModule } from '@/mailer/mailer.module';

@Module({
	imports: [TypeOrmModule.forFeature([User]), VerificationModule, MailerModule],
	controllers: [UsersController],
	providers: [UsersService],
})
export class UsersModule {}
