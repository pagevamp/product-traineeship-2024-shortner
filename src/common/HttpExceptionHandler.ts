import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { env } from '@/config/env.config';

@Catch(HttpException)
export class HttpExceptionHandler implements ExceptionFilter {
	private readonly isProduction = env.NODE_ENV === 'production';
	private readonly logger = new Logger();
	catch(exception: HttpException, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const statusCode = exception.getStatus();
		const message = exception.message;
		const error = exception.name;
		const stack = exception.stack;

		response.status(statusCode).json({
			error,
			statusCode,
			message,
			...(this.isProduction ? {} : { stack }),
			timestamp: new Date().toISOString(),
			path: request.url,
		});
		this.logger.error(`(${statusCode}) ${message} at ${request.url}`);
	}
}
