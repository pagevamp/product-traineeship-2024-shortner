import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEmailCodesTable1736417420818 implements MigrationInterface {
	name = 'CreateEmailCodesTable1736417420818';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "email_codes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "otp_code" character varying NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_6ed15013da989317f69306da6e3" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`ALTER TABLE "email_codes" ADD CONSTRAINT "FK_60a2fdb525cba0453b3f5a342d4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "email_codes" DROP CONSTRAINT "FK_60a2fdb525cba0453b3f5a342d4"`);
		await queryRunner.query(`DROP TABLE "email_codes"`);
	}
}
