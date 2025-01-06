import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { env } from '@/config/env.config';

@Module({
	imports: [
		UsersModule,
		JwtModule.register({
			global: true,
			secret: env.JWT_SECRET,
			signOptions: { expiresIn: `${env.JWT_EXPIRATION}s` },
		}),
	],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
