import { MigrationInterface, QueryRunner } from 'typeorm';

export class MyInit1736148136586 implements MigrationInterface {
	name = 'MyInit1736148136586';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_verified"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "verifiedAt" date`);
		await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" date NOT NULL DEFAULT '"2025-01-06T07:22:18.157Z"'`);
		await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" date NOT NULL DEFAULT '"2025-01-06T07:22:18.157Z"'`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "verifiedAt"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "is_verified" boolean NOT NULL DEFAULT false`);
	}
}
