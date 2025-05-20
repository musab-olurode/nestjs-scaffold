import { IDAndTimestamp } from '@/database/entities/id-and-timestamp.entity';

import { Column, Entity } from 'typeorm';

@Entity()
export class Verification extends IDAndTimestamp {
	@Column({ type: String })
	identifier: string;

	@Column({ type: String })
	value: string;

	@Column({ type: Date })
	expiresAt: Date;
}
