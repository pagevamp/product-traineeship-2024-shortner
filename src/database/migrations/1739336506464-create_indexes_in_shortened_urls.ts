import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIndexesInShortenedUrls1739336506464 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`
            CREATE INDEX IX_shortened_urls_short_code ON shortened_urls(short_code);
            `,
		);

		await queryRunner.query(
			`
            CREATE INDEX IX_shortened_urls_original_url ON shortened_urls USING GIN (to_tsvector('english', original_url));
            `,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`
            DROP INDEX IX_shortened_urls_short_code
            `,
		);

		await queryRunner.query(
			`
            DROP INDEX IX_shortened_urls_original_url 
            `,
		);
	}
}
