import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/users/entities/user.entity';

@Entity('email_codes')
export class Verification {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	user_id: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@Column()
	otp_code: string;

	@Column()
	expires_at: Date;

	@CreateDateColumn()
	created_at: Date;
}
