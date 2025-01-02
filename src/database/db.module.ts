import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataBaseConfigurations } from '@/database/db.config';
import { DataSource, DataSourceOptions, TypeORMError } from 'typeorm';
import { env } from '@/config/env.config';
import { Logger } from '@nestjs/common';

const logger = new Logger();

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: () => {
				return {
					host: env.DB_HOST,
					...dataBaseConfigurations,
				};
			},
			dataSourceFactory: async (options: DataSourceOptions) => {
				try {
					const dataSource = await new DataSource(options).initialize();
					logger.log(' ------ Connected to Database successfully -----');
					return dataSource;
				} catch (error) {
					throw new TypeORMError(`Error Connection to database , "${error}"`);
				}
			},
		}),
	],
})
export class DatabaseModule {}
