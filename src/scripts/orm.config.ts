import { writeFile } from 'fs/promises';
import { DataSource } from 'typeorm';
import { dataBaseConfigurations } from '@/database/db.config';

const dataSource = new DataSource(dataBaseConfigurations);
writeFile('ormconfig.json', JSON.stringify(dataSource.options, null, 2));
export { dataSource };
