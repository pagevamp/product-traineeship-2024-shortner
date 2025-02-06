import { DataSource } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { ShortUrl } from '@/short-urls/entities/short-url.entity';
import { UrlAnalytics } from '@/url-analytics/entities/url-analytics.entity';
import { promises as fs } from 'fs';
import * as path from 'path';

export async function seedDatabase(dataSource: DataSource): Promise<void> {
	const userRepository = dataSource.getRepository(User);
	const shortenedUrlRepository = dataSource.getRepository(ShortUrl);
	const redirectionLogRepository = dataSource.getRepository(UrlAnalytics);

	const seedDataPath = path.join(process.cwd(), './src/database/seeding/seed-data.json');
	const seedData = JSON.parse(await fs.readFile(seedDataPath, 'utf-8'));

	const users = seedData.users.map((user: User) =>
		userRepository.create({
			...user,
		}),
	);
	await userRepository.save(users);

	const shortenedUrls: ShortUrl[] = seedData.urls.map((url: ShortUrl) =>
		shortenedUrlRepository.create({
			...url,
			user_id: users[url.user_id].id,
		}),
	);
	await shortenedUrlRepository.save(shortenedUrls);

	const redirectionLogs: UrlAnalytics[] = [];

	shortenedUrls.forEach((shortenedUrl) => {
		for (let i = 0; i < 50; i++) {
			redirectionLogs.push(
				redirectionLogRepository.create({
					short_url_id: shortenedUrl.id,
					user_id: shortenedUrl.user_id,
					clicked_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
					ip_address: seedData.analytics.ips[Math.floor(Math.random() * seedData.analytics.ips.length)],
					user_agent: `Mozilla/5.0 Browser/${
						seedData.analytics.browsers[Math.floor(Math.random() * seedData.analytics.browsers.length)]
					}`,
					browser: seedData.analytics.browsers[Math.floor(Math.random() * seedData.analytics.browsers.length)],
					device: seedData.analytics.devices[Math.floor(Math.random() * seedData.analytics.devices.length)],
					operating_system:
						seedData.analytics.operatingSystems[Math.floor(Math.random() * seedData.analytics.operatingSystems.length)],
					country: seedData.analytics.countries[Math.floor(Math.random() * seedData.analytics.countries.length)],
				}),
			);
		}
	});

	await redirectionLogRepository.save(redirectionLogs);
	console.log('Database seeded successfully.');
}
