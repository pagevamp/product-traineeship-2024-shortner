import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private userService: UsersService,
		private jwtService: JwtService,
	) {}

	//create a seperate response type for this function return.
	//For now keeping object **must be changed**
	async login(loginDto: LoginDto): Promise<object> {
		const { email, password } = loginDto;
		const user = await this.userService.findByEmail(email);
		if (!user) {
			throw new Error('User not found');
		}
		const isPasswordValid = await bcrypt.compare(password, user.password_hash);
		if (!isPasswordValid) {
			throw new UnauthorizedException('invalid credentials');
		}

		//change error message after main branch gets updated

		const { name, is_verified } = user;
		const payload = {
			email,
			name,
			is_verified,
		};
		return {
			access_token: await this.jwtService.signAsync(payload),
		};
	}
}
