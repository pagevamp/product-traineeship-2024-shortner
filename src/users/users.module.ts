import { Module } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { UsersController } from '@/users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';
import { VerificationModule } from '@/verification/verification.module';
import { MailerModule } from '@/mailer/mailer.module';

@Module({
	imports: [TypeOrmModule.forFeature([User]), VerificationModule, MailerModule],
	controllers: [UsersController],
	providers: [UsersService],
})
export class UsersModule {}
