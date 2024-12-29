import { writeFile } from 'fs/promises';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { env, APP_ENVIRONVENT } from '@/config/env.config';

const dataBaseConfigurations = {
	type: 'postgres',
	port: +env.POSTGRES_PORT,
	username: env.POSTGRES_USER,
	password: env.POSTGRES_PASSWORD,
	database: env.POSTGRES_DB,
	synchronize: env.NODE_ENV === APP_ENVIRONVENT.PRODUCTION ? false : true, // Should be false in production to use migrations
	logging: true,
	entities: [join(__dirname, '/../entities', '*.entity.{ts,js}')],
	migrations: [join(__dirname, '/../migrations', '*.{ts,js}')],
};
const dataSource = new DataSource(dataBaseConfigurations as DataSourceOptions);

writeFile('ormconfig.json', JSON.stringify(dataSource.options, null, 2));
export { dataSource, dataBaseConfigurations };
