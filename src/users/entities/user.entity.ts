import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	email: string;

	@Column()
	password_hash: string;

	@Column()
	name: string;

	@Column({ default: false })
	is_verified: boolean;
}
