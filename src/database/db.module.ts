import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { dataBaseConfigurations } from '@/scripts/orm.config';
import { DataSource, DataSourceOptions, TypeORMError } from 'typeorm';
import { env } from '@/config/env.config';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: () => {
				return {
					host: env.DB_HOST,
					...dataBaseConfigurations,
				} as TypeOrmModuleOptions;
			},
			dataSourceFactory: async (options: DataSourceOptions) => {
				try {
					const dataSource = await new DataSource(options).initialize();
					console.log(' ------ Connected to Database successfully -----');
					return dataSource;
				} catch (error) {
					throw new TypeORMError(`Error Connection to database , "${error}"`);
				}
			},
		}),
	],
})
export class DatabaseModule {}
