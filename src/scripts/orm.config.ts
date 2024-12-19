import { config } from 'dotenv';
import { join } from 'path';
config();

export const dataBaseConfigurations = {
	type: 'postgres',
	port: +(process.env.POSTGRES_PORT || '5432'),
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	synchronize: false, // Should be false in production to use migrations
	logging: true,
	entities: [join(__dirname, '/../entities', '*.entity.{ts,js}')],
	migrations: [join(__dirname, '/../migrations', '*.{ts,js}')],
};
