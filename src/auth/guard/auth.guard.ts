import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { env } from '@/config/env.config';
import { errorMessage } from '@/common/messages';
import { Reflector } from '@nestjs/core';
import { TO_AVOID } from '@/decorator/avoid-guard.decorator';
import { UsersService } from '@/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		@Inject(Reflector) protected reflector: Reflector,
		private usersService: UsersService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);
		const toAvoid = this.reflector.getAllAndOverride<boolean>(TO_AVOID, [context.getHandler(), context.getClass()]);

		if (toAvoid) {
			return true;
		}
		if (!token) {
			throw new UnauthorizedException(errorMessage.tokenMissing);
		}

		try {
			const payload = await this.jwtService.verify(token, { secret: env.JWT_SECRET });
			await this.usersService.findById(payload.id);
			request['user'] = payload;
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw new NotFoundException(errorMessage.userNotFound);
			}
			throw new UnauthorizedException('failed to authenticate');
		}

		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}
