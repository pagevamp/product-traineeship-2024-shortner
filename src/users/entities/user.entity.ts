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
	verifiedAt: Date;

	@Column({ type: 'date' })
	createdAt: Date;

	@Column({ type: 'date' })
	updatedAt: Date;
}
