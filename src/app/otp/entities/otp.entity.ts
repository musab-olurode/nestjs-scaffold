import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { Timestamp } from '../../../database/entities/timestamp.entity';
import { OTPReason } from '../../../types/otp';
import { User } from '../../users/entities/user.entity';

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
