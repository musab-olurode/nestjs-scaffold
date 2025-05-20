import { User } from '@/app/users/entities/user.entity';
import { IDAndTimestamp } from '@/database/entities/id-and-timestamp.entity';

import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Account extends IDAndTimestamp {
	@ManyToOne(() => User)
	@JoinColumn({ name: 'userId' })
	userId: string;

	@Column({ type: String })
	accountId: string;

	@Column({ type: String })
	providerId: string;

	@Column({ type: String, nullable: true })
	accessToken: string | null;

	@Column({ type: String, nullable: true })
	refreshToken: string | null;

	@Column({ type: Date, nullable: true })
	accessTokenExpiresAt: Date | null;

	@Column({ type: Date, nullable: true })
	refreshTokenExpiresAt: Date | null;

	@Column({ type: String, nullable: true })
	scope: string | null;

	@Column({ type: String, nullable: true })
	idToken: string | null;

	@Column({ type: String, nullable: true })
	password: string | null;
}
