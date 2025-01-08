import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';
import { TokenResponse } from '@/common/response.interface';
import { errorMessage } from '@/common/messages';

@Injectable()
export class AuthService {
	constructor(
		private userService: UsersService,
		private jwtService: JwtService,
	) {}
	async login(loginDto: LoginDto): Promise<TokenResponse | undefined> {
		const { email, password } = loginDto;
		const user = await this.userService.findByEmail(email);
		const { id, name, verified_at, password_hash } = user;
		const isPasswordValid = await bcrypt.compare(password, password_hash);
		if (!isPasswordValid) {
			throw new UnauthorizedException(errorMessage.invalidCredentials);
		}
		if (!verified_at) {
			throw new UnauthorizedException(errorMessage.notVerified);
		}
		const payload = {
			id,
			email,
			name,
			verifiedAt: verified_at,
		};
		return {
			accessToken: await this.jwtService.signAsync(payload),
		};
	}
}