import { User } from '@/users/entities/user.entity';
import 'express';

declare module 'express' {
	export interface Request {
		user?: User;
	}
}
