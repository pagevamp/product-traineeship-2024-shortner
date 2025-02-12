import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { env } from '@/config/env.config';
import { LoggerService } from '@/logger/logger.service';
import { errorMessage } from '@/common/messages';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(private readonly logger: LoggerService) {}
	private readonly isProduction = env.NODE_ENV === 'production';

	catch(exception: unknown, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
		const message =
			exception instanceof HttpException
				? this.getHttpErrorMessage(exception)
				: exception instanceof Error
					? exception.message
					: errorMessage.smthWentWrong;
		const stack = exception instanceof Error ? exception.stack : undefined;

		if (statusCode === HttpStatus.TOO_MANY_REQUESTS) {
			response.setHeader('Retry-After', '120');
		}
		response.status(statusCode).json({
			statusCode,
			message,
			...(this.isProduction ? {} : { stack }),
			timestamp: new Date().toISOString(),
			path: request.url,
		});

		this.logger.error(`(${statusCode}) ${exception} at ${request.url}`);
	}

	private getHttpErrorMessage(exception: HttpException): string | string[] {
		const response = exception.getResponse();
		if (typeof response === 'object' && 'message' in response) {
			return response.message as string;
		}
		return exception.message;
	}
}
