import { User } from '@/app/users/entities/user.entity';
import { IDAndTimestamp } from '@/database/entities/id-and-timestamp.entity';

import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Session extends IDAndTimestamp {
	@ManyToOne(() => User)
	@JoinColumn({ name: 'userId' })
	userId: string;

	@Column({ type: String })
	token: string;

	@Column({ type: Date })
	expiresAt: Date;

	@Column({ type: String, nullable: true })
	ipAddress: string | null;

	@Column({ type: String, nullable: true })
	userAgent: string | null;

	@Column({ type: String, nullable: true })
	impersonatedBy: string | null;
}
