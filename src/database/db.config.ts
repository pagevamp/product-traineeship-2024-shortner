import { env } from '@/config/env.config';
import { join } from 'path';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
config();

export const dataBaseConfigurations: DataSourceOptions = {
	type: 'postgres',
	port: +env.POSTGRES_PORT,
	host: env.DB_HOST,
	username: env.POSTGRES_USER,
	password: env.POSTGRES_PASSWORD,
	database: env.POSTGRES_DB,
	synchronize: false,
	ssl: true,
	extra: {
		ssl: {
			rejectUnauthorized: false,
		},
	},
	logging: true,
	entities: [join(__dirname, '/../**/entities', '*.entity.{ts,js}')],
	migrations: [join(__dirname, '/../database/migrations', '*.{ts,js}')],
};
export const dataSource = new DataSource(dataBaseConfigurations);
