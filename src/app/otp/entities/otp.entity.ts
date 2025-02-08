import { User } from '@/app/users/entities/user.entity';
import { Timestamp } from '@/database/entities/timestamp.entity';

import { OTPReason } from '@/types/otp';

import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('otp')
export class OTP extends Timestamp {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'enum', enum: OTPReason })
	reason: OTPReason;

	@Column()
	code: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User;
}
