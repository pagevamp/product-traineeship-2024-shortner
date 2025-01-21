import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { LoginDto } from '@/auth/dto/login.dto';
import { TokenResponse } from '@/common/response.interface';
import { successMessage } from '@/common/messages';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
	@Post('login')
	async login(@Body() loginDto: LoginDto): Promise<TokenResponse> {
		const jwt = await this.authService.login(loginDto);
		return {
			status: HttpStatus.OK,
			message: successMessage.loginSuccess,
			accessToken: jwt,
		};
	}
}
