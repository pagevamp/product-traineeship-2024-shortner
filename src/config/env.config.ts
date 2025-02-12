import { z } from 'zod';
import { config } from 'dotenv';
import { errorMessage } from '@/common/messages';
config();
export const env = {
	POSTGRES_DB: process.env.POSTGRES_DB,
	POSTGRES_USER: process.env.POSTGRES_USER,
	POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
	POSTGRES_PORT: +(process.env.POSTGRES_PORT || 5432),
	DB_HOST: process.env.DB_HOST,
	APP_PORT: +(process.env.APP_PORT || 3000),
	NODE_ENV: process.env.NODE_ENV,
	EMAIL_HOST: process.env.EMAIL_HOST,
	EMAIL_PASS: process.env.EMAIL_PASS,
	EMAIL_USER: process.env.EMAIL_USER,
	EMAIL_SENDER_NAME: process.env.EMAIL_SENDER_NAME,
	EMAIL_PORT: +(process.env.EMAIL_PORT || 587),
	REDIS_USERNAME: process.env.REDIS_USERNAME,
	REDIS_PASSWORD: process.env.REDIS_PASSWORD,
	REDIS_HOST: process.env.REDIS_HOST,
	REDIS_PORT: +(process.env.REDIS_PORT || 6379),
	JWT_SECRET: process.env.JWT_SECRET,
	JWT_EXPIRATION: process.env.JWT_EXPIRATION,
	SALT_ROUND: +(process.env.SALT_ROUND || 10),
	LOGTAIL_TOKEN: process.env.LOGTAIL_TOKEN,
	DEFAULT_URL_EXPIRY_TIME: process.env.DEFAULT_URL_EXPIRY_TIME || '1 day',
	CORS_ORIGIN: process.env.CORS_ORIGIN,
} as const;

export enum APP_ENVIRONVENT {
	DEVELOPMENT = 'development',
	PRODUCTION = 'production',
}

enum SMTP_PORTS {
	STANDARD = 25,
	DEFAULT = 587,
	TLS = 465,
}
const envSchema = z
	.object({
		POSTGRES_DB: z.string().min(2, { message: errorMessage.minTwoLengthValidation }),
		POSTGRES_USER: z.string().min(2, { message: errorMessage.minTwoLengthValidation }),
		POSTGRES_PASSWORD: z.string().min(2, { message: errorMessage.minTwoLengthValidation }),
		POSTGRES_PORT: z.coerce
			.number()
			.gt(0, { message: `Port${errorMessage.cannotBeEmpty}` })
			.default(5432),
		DB_HOST: z.string().min(2, { message: errorMessage.minTwoLengthValidation }),
		APP_PORT: z.coerce
			.number()
			.gt(0, { message: `Port${errorMessage.cannotBeEmpty}` })
			.default(3000),
		NODE_ENV: z.nativeEnum(APP_ENVIRONVENT),
		EMAIL_HOST: z.string().min(2, { message: errorMessage.minTwoLengthValidation }),
		EMAIL_PORT: z.nativeEnum(SMTP_PORTS).default(587),
		EMAIL_USER: z.string().min(2, { message: errorMessage.minTwoLengthValidation }),
		EMAIL_PASS: z.string().min(2, { message: errorMessage.minTwoLengthValidation }),
		EMAIL_SENDER_NAME: z.string().min(2, { message: errorMessage.minTwoLengthValidation }),
		REDIS_USERNAME: z.string(),
		REDIS_PASSWORD: z.string(),
		REDIS_PORT: z.number().gt(0, { message: `Port${errorMessage.cannotBeEmpty}` }),
		REDIS_HOST: z.string().min(2, { message: errorMessage.minTwoLengthValidation }),
		JWT_SECRET: z.string().min(5, { message: errorMessage.minFiveLengthValidation }),
		JWT_EXPIRATION: z.string().min(1, { message: `JWT_EXPIRATION time${errorMessage.cannotBeEmpty}` }),
		SALT_ROUND: z.coerce.number().default(10),
		LOGTAIL_TOKEN: z.string().min(5),
		DEFAULT_URL_EXPIRY_TIME: z.string(),
		CORS_ORIGIN: z.string().url(),
	})
	.required();

type EnvSchema = z.infer<typeof envSchema>;

export const validate = (): EnvSchema => {
	const value = envSchema.safeParse(env);
	if (!value.success) {
		throw new Error(`---${value.error.issues[0].path} :: ${value.error.issues[0].message.toUpperCase()}---`);
	}
	return value.data;
};
