import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('email_codes')
export class Verification {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	user_id: string;

	@ManyToOne(() => User, (users) => users.id)
	user: User;

	@Column()
	otp_code: string;

	@Column()
	expires_at: Date;

	@CreateDateColumn()
	created_at: Date;
}
