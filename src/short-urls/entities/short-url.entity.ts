import { User } from '@/users/entities/user.entity';
import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('shortened_urls')
export class ShortUrl {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	user_id: string;

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user: User;

	@Column()
	original_url: string;

	@Column({ type: 'varchar', length: 8, unique: true })
	short_code: string;

	@Column({ type: 'timestamptz', default: () => "NOW() + INTERVAL '1 day'" })
	expires_at: Date;

	@CreateDateColumn({ type: 'timestamptz' })
	created_at: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	updated_at: Date;

	@DeleteDateColumn({ type: 'timestamptz' })
	deleted_at: Date;
}
