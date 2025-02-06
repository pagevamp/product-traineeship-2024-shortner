import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRedirectionLogsTable1737529897767 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
			CREATE TABLE "redirection_logs" (
            id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            short_url_id uuid NOT NULL,
            user_id uuid NOT NULL,
            clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            ip_address character varying(45),
            country character varying(100),
            user_agent character varying,
            browser character varying(100),
            device character varying(100),
            operating_system character varying(100),
            CONSTRAINT FK_redirection_logs_shortened_urls FOREIGN KEY (short_url_id)
                REFERENCES shortened_urls (id)
                ON DELETE CASCADE
                ON UPDATE CASCADE,
            CONSTRAINT FK_redirection_logs_users FOREIGN KEY (user_id)
                REFERENCES users (id)
                ON DELETE CASCADE
                ON UPDATE CASCADE
            )`);
		await queryRunner.query(`
            CREATE INDEX IX_redirection_logs_short_url_id ON redirection_logs(short_url_id)
            `);
		await queryRunner.query(`
            CREATE INDEX IX_redirection_logs_clicked_at ON redirection_logs using brin (clicked_at)
            `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "redirection_logs"`);
	}
}
