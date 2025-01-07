import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { UserService } from '@/users/user.service';
import { VerifyUserDto } from '@/users/dto/verifyUser.dto';

@Controller('user')
export class UserController {
	private readonly logger = new Logger();
	constructor(private readonly userService: UserService) {}
	//! This is temporary for now untill signup route is created. We don't need to cerate spearate route for this.
	@Post('send')
	async generateEmailVerification(@Body() verifyUserDto: VerifyUserDto): Promise<object> {
		//! we can call this method in user signup process.
		await this.userService.sendEmailVerification(verifyUserDto.email);
		return { status: 'success', message: 'Verification Email sent' };
	}

	@Post('verify')
	@HttpCode(HttpStatus.OK)
	async verifyEmail(@Body() verifyUserDto: VerifyUserDto): Promise<object | undefined> {
		await this.userService.verifyEmail(verifyUserDto.email, verifyUserDto.otp);
		this.logger.log(`${verifyUserDto.email} verified successfully.`);
		return { status: 'sucess', message: 'User verified successfully' };
	}
}
