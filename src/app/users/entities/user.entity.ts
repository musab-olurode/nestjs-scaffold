import { IDAndTimestamp } from '@/database/entities/id-and-timestamp.entity';

import { CapitalizeTransformer } from '@/utils/transformers/capitalize';

import { Column, Entity } from 'typeorm';

@Entity()
export class User extends IDAndTimestamp {
	@Column({
		transformer: new CapitalizeTransformer(),
	})
	firstName: string;

	@Column({
		transformer: new CapitalizeTransformer(),
	})
	lastName: string;

	@Column({ unique: true })
	email: string;

	@Column({ default: false })
	emailVerified: boolean;

	@Column({ type: String, nullable: true })
	image: string | null;

	@Column({ default: 'user' })
	role: string;

	@Column({ default: false })
	banned: boolean;

	@Column({ type: String, nullable: true })
	banReason: string | null;

	@Column({ type: Date, nullable: true })
	banExpires: Date | null;
}
