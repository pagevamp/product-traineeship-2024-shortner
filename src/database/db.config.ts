import { env, APP_ENVIRONVENT } from '@/config/env.config';
import { join } from 'path';
import { config } from 'dotenv';
import { DataSourceOptions } from 'typeorm';
config();

export const dataBaseConfigurations: DataSourceOptions = {
	type: 'postgres',
	port: +env.POSTGRES_PORT,
	username: env.POSTGRES_USER,
	password: env.POSTGRES_PASSWORD,
	database: env.POSTGRES_DB,
	synchronize: env.NODE_ENV === APP_ENVIRONVENT.DEVELOPMENT, // Should be false in production to use migrations
	logging: true,
	entities: [join(__dirname, '/../entities', '*.entity.{ts,js}')],
	migrations: [join(__dirname, '/../migrations', '*.{ts,js}')],
};
