import { User } from '@/users/entities/user.entity';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

type RawUserResponse = {
	status: string;
	message: string;
	data: User[];
};

type TransformedUser = {
	id: string;
	email: string;
	name: string;
	verifiedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
};

type TransformedUserResponse = {
	status: string;
	message: string;
	data: TransformedUser[];
};
export class CustomUserInterceptor implements NestInterceptor {
	public intercept(
		context: ExecutionContext,
		next: CallHandler<RawUserResponse>,
	): Observable<TransformedUserResponse> | Promise<Observable<TransformedUserResponse>> {
		return next.handle().pipe(
			map((respData) => ({
				...respData,
				data: respData.data.map((user: User) => ({
					id: user.id,
					email: user.email,
					name: user.name,
					verifiedAt: user.verified_at,
					createdAt: user.created_at,
					updatedAt: user.updated_at,
				})),
			})),
		);
	}
}
