import { User } from '@/app/users/entities/user.entity';
import { IDAndTimestamp } from '@/database/entities/id-and-timestamp.entity';

import { OTPReason } from '@/types/otp';

import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('otp')
export class OTP extends IDAndTimestamp {
	@Column({ type: 'enum', enum: OTPReason })
	reason: OTPReason;

	@Column()
	code: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'userId' })
	user: User;
}
