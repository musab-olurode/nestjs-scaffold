import { User } from '@/app/users/entities/user.entity';
import { Timestamp } from '@/database/entities/timestamp.entity';

import * as bcrypt from 'bcrypt';
import {
	BeforeInsert,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PasswordReset extends Timestamp {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@Column()
	token: string;

	@BeforeInsert()
	private generateToken() {
		const token = Math.floor(1000 + Math.random() * 9000).toString();

		this.token = bcrypt.hashSync(token, 12);
	}
}
