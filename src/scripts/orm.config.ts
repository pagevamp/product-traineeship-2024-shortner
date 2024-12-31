import { writeFile } from 'fs/promises';
import { DataSource, DataSourceOptions } from 'typeorm';
import { dataBaseConfigurations } from '@/database/db.config';

const dataSource = new DataSource(dataBaseConfigurations as DataSourceOptions);
console.log(dataBaseConfigurations);
writeFile('ormconfig.json', JSON.stringify(dataSource.options, null, 2));
export { dataSource };
