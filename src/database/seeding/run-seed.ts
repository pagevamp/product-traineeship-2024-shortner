import { dataSource } from '@/database/db.config';
import { seedDatabase } from '@/database/seeding/seeder';

dataSource
	.initialize()
	.then(async (dataSource) => {
		await seedDatabase(dataSource);
		console.log('Seeding complete');
		await dataSource.destroy();
	})
	.catch((error) => console.error('Error seeding database:', error));
