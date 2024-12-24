import { writeFile } from 'fs/promises';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { envVariables } from '@/config/env.config';

const dataBaseConfigurations = {
	type: 'postgres',
	port: +(envVariables.POSTGRES_PORT ?? '5432'),
	username: envVariables.POSTGRES_USER,
	password: envVariables.POSTGRES_PASSWORD,
	database: envVariables.POSTGRES_DB,
	synchronize: false, // Should be false in production to use migrations
	logging: true,
	entities: [join(__dirname, '/../entities', '*.entity.{ts,js}')],
	migrations: [join(__dirname, '/../migrations', '*.{ts,js}')],
};
const dataSource = new DataSource(dataBaseConfigurations as DataSourceOptions);

writeFile('ormconfig.json', JSON.stringify(dataSource.options, null, 2));
export { dataSource, dataBaseConfigurations };
