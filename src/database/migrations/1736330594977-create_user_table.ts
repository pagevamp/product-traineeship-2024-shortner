import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1736330594977 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE users(
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email VARCHAR NOT NULL,
            password_hash VARCHAR NOT NULL,
            name VARCHAR NOT NULL,
            verified_at TIMESTAMPTZ DEFAULT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            deleted_at TIMESTAMPTZ DEFAULT NULL,
            CONSTRAINT UQ_Users_Email UNIQUE (email)
            );`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE users;`);
	}
}
