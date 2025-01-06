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

	@Column({ type: 'date', default: new Date() })
	createdAt: Date;

	@Column({ type: 'date', default: new Date() })
	updatedAt: Date;
}
