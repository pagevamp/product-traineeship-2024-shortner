import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	email: string;

	@Column()
	password_hash: string;

	@Column()
	name: string;

	@Column({ default: false })
	is_verified: boolean;
}
