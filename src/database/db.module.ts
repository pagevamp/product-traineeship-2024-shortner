import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { dataBaseConfigurations } from 'src/scripts/orm.config';
import { DataSource, DataSourceOptions, TypeORMError } from 'typeorm';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: () => {
				return {
					host: process.env.DB_HOST,
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
