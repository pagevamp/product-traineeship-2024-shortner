/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { DataSource } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { ShortUrl } from '@/short-urls/entities/short-url.entity';
import { UrlAnalytics } from '@/url-analytics/entities/url-analytics.entity';

export async function seedDatabase(dataSource: DataSource) {
	const userRepository = dataSource.getRepository(User);
	const shortenedUrlRepository = dataSource.getRepository(ShortUrl);
	const redirectionLogRepository = dataSource.getRepository(UrlAnalytics);

	const users = [
		userRepository.create({
			email: 'ram@example.com',
			password_hash: 'test@123',
			name: 'Ram',
			verified_at: new Date(),
		}),
		userRepository.create({
			email: 'sita@example.com',
			password_hash: 'test@456',
			name: 'Sita',
			verified_at: new Date(),
		}),
	];
	await userRepository.save(users);

	const shortenedUrls = [
		shortenedUrlRepository.create({
			user_id: users[0].id,
			original_url: 'https://www.iban.com/country-codes',
			short_code: 'AbCd12',
			expires_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
		}),
		shortenedUrlRepository.create({
			user_id: users[0].id,
			original_url: 'https://neon.tech/postgresql/postgresql-tutorial/postgresql-group-by',
			short_code: 'EfGh34',
			expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
		}),
		shortenedUrlRepository.create({
			user_id: users[1].id,
			original_url: 'https://neon.tech/docs/data-types/array',
			short_code: 'IjKl56',
			expires_at: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
		}),
		shortenedUrlRepository.create({
			user_id: users[1].id,
			original_url: 'https://kb.objectrocket.com/postgresql/join-three-tables-in-postgresql-539',
			short_code: 'MnOp78',
			expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
		}),
	];
	await shortenedUrlRepository.save(shortenedUrls);

	const redirectionLogs: any[] = [];
	const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
	const devices = ['Desktop', 'Mobile', 'Tablet'];
	const ips = ['192.168.0.1', '10.0.0.2', '172.16.0.3', '203.0.113.4', '8.8.8.8'];
	const countries = ['NP', 'IN', 'CN', 'US', 'RU'];

	shortenedUrls.forEach((shortenedUrl) => {
		for (let i = 0; i < 200; i++) {
			redirectionLogs.push(
				redirectionLogRepository.create({
					short_url_id: shortenedUrl.id,
					user_id: shortenedUrl.user_id,
					clicked_at: new Date(Date.now() - (i % 10) * 24 * 60 * 60 * 1000),
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
