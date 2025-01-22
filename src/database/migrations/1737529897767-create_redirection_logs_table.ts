import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRedirectionLogsTable1737529897767 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
			CREATE TABLE "redirection_logs" (
            id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            short_url_id uuid NOT NULL,
            clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            ip_address character varying(45),
            user_agent character varying,
            browser character varying(100),
            device character varying(100),
            CONSTRAINT FK_redirection_logs_shortened_urls FOREIGN KEY (short_url_id)
                REFERENCES shortened_urls (id)
                ON DELETE CASCADE
                ON UPDATE CASCADE
            )`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "redirection_logs"`);
	}
}
