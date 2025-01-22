import { ShortUrl } from '@/short-urls/entities/short-url.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('redirection_logs')
export class UrlAnalytics {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	short_url_id: string;

	@ManyToOne(() => ShortUrl, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'short_url_id' })
	short_url: ShortUrl;

	@CreateDateColumn({ type: 'timestamptz' })
	clicked_at: Date;

	@Column({ type: 'varchar', length: 45, nullable: true })
	ip_address: string;

	@Column({ type: 'text', nullable: true })
	user_agent: string;

	@Column({ type: 'varchar', length: 100, nullable: true })
	browser: string;

	@Column({ type: 'varchar', length: 100, nullable: true })
	device: string;
}
