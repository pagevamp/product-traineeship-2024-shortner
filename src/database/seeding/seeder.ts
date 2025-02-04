import { DataSource } from 'typeorm';
import { promises as fs } from 'fs';
import path from 'path';
import { User } from '@/users/entities/user.entity';
import { ShortUrl } from '@/short-urls/entities/short-url.entity';
import { UrlAnalytics } from '@/url-analytics/entities/url-analytics.entity';

export async function seedDatabase(dataSource: DataSource): Promise<void> {
	const userRepository = dataSource.getRepository(User);
	const shortenedUrlRepository = dataSource.getRepository(ShortUrl);
	const redirectionLogRepository = dataSource.getRepository(UrlAnalytics);

	const seedDataPath = path.join(__dirname, 'seed-data.json');
	const seedData = JSON.parse(await fs.readFile(seedDataPath, 'utf-8'));

	const users = seedData.users.map((user: User) =>
		userRepository.create({
			...user,
			verified_at: new Date(),
		}),
	);
	await userRepository.save(users);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const shortenedUrls = seedData.shortenedUrls.map((url: any) =>
		shortenedUrlRepository.create({
			user_id: users[url.user_id].id,
			original_url: url.original_url,
			short_code: url.short_code,
			expires_at: new Date(Date.now() + url.expires_at * 24 * 60 * 60 * 1000),
		}),
	);
	await shortenedUrlRepository.save(shortenedUrls);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const redirectionLogs: any[] = [];
	const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
	const devices = ['Desktop', 'Mobile', 'Tablet'];
	const ips = ['192.168.0.1', '10.0.0.2', '172.16.0.3', '203.0.113.4', '8.8.8.8'];
	const countries = ['NP', 'IN', 'CN', 'US', 'RU'];
	const startDate = new Date('2025-01-01T00:00:00');
	const endDate = new Date('2025-02-01T23:59:59');

	shortenedUrls.forEach((shortenedUrl: { id: string; user_id: string }) => {
		for (let i = 0; i < 200; i++) {
			const randomClickedAt = getRandomDate(startDate, endDate);
			redirectionLogs.push(
				redirectionLogRepository.create({
					short_url_id: shortenedUrl.id,
					user_id: shortenedUrl.user_id,
					clicked_at: randomClickedAt,
					ip_address: ips[i % ips.length],
					user_agent: `Browser/${browsers[i % browsers.length]} Device/${devices[i % devices.length]}`,
					browser: browsers[i % browsers.length],
					device: devices[i % devices.length],
					country: countries[i % countries.length],
				}),
			);
		}
	});

	await redirectionLogRepository.save(redirectionLogs);
	console.log('Database seeded successfully.');
}

function getRandomDate(start: Date, end: Date): Date {
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
