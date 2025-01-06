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

	@Column({ type: 'date', default: null })
	verified_at: Date;

	@Column({ type: 'date' })
	created_at: Date;

	@Column({ type: 'date' })
	updated_at: Date;
}
