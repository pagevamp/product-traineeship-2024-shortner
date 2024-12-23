import { config } from 'dotenv';
import { z } from 'zod';
config();
export const envVariables = {
	POSTGRES_DB: process.env.POSTGRES_DB,
	POSTGRES_USER: process.env.POSTGRES_USER,
	POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
	POSTGRES_PORT: +(process.env.POSTGRES_PORT || 5432),
	DB_HOST: process.env.DB_HOST,
	APP_PORT: +(process.env.APP_PORT || 3000),
	NODE_ENV: process.env.NODE_ENV,
} as const;

enum APP_ENVIRONVENT {
	DEVELOPMENT = 'development',
	PRODUCTION = 'production',
}
const validationSchema = z
	.object({
		POSTGRES_DB: z.string().min(2, { message: 'Must be atleast 2 characters long' }),
		POSTGRES_USER: z.string().min(2, { message: 'Must be atleast 2 characters long' }),
		POSTGRES_PASSWORD: z.string().min(2, { message: 'Must be atleast 2 characters long' }),
		POSTGRES_PORT: z.number().gt(0, { message: 'Port cannot be empty' }),
		DB_HOST: z.string().min(2, { message: 'Must be atleast 2 characters long' }),
		APP_PORT: z.number().gt(0, { message: 'Port cannot be empty' }),
		NODE_ENV: z.nativeEnum(APP_ENVIRONVENT),
	})
	.required();

export const validate = (): object => {
	const value = validationSchema.safeParse(envVariables);
	if (!value.success) {
		throw new Error(`---${value.error.issues[0].path} :: ${value.error.issues[0].message.toUpperCase()}---`);
	}
	return value.data;
};
