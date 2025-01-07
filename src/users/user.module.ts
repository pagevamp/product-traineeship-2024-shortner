import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { VerificationModule } from '@/verification/verification.module';
import { MailerModule } from '@/mailer/mailer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([User]), VerificationModule, MailerModule],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserModule],
})
export class UserModule {}
