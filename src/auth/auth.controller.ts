import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
	@Post('login')
	async login(@Body() loginDto: LoginDto): Promise<object> {
		const jwt = await this.authService.login(loginDto);
		return jwt;
	}
}
