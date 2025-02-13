import { ShortUrl } from '@/short-urls/entities/short-url.entity';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

type RawURLResponse = {
	status: string;
	message: string;
	data: ShortUrl[];
};

type TransformedUrl = {
	shortCode: string;
	expiryDate: Date;
};

type TransformedUrlResponse = {
	status: string;
	message: string;
	data: TransformedUrl[];
};

export class CustomShortURLInterceptor implements NestInterceptor {
	public intercept(
		context: ExecutionContext,
		next: CallHandler<RawURLResponse>,
	): Observable<TransformedUrlResponse> | Promise<Observable<TransformedUrlResponse>> {
		const req = context.switchToHttp().getRequest();
		const method = req['method'];
		if (method === 'GET') {
			return next.handle().pipe(
				map((respData) => ({
					...respData,
					data: respData.data.map((shortUrl: ShortUrl) => ({
						id: shortUrl.id,
						userId: shortUrl.user_id,
						shortCode: shortUrl.short_code,
						originalUrl: shortUrl.original_url,
						expiryDate: shortUrl.expires_at,
						createdAt: shortUrl.created_at,
						updatedAt: shortUrl.updated_at,
					})),
				})),
			);
		}
		return next.handle().pipe(
			map((respData) => ({
				...respData,
				data: respData.data.map((shortUrl: ShortUrl) => ({
					shortCode: shortUrl.short_code,
					expiryDate: shortUrl.expires_at,
				})),
			})),
		);
	}
}
