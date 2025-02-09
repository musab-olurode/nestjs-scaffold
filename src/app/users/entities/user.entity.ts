import { Timestamp } from '@/database/entities/timestamp.entity';

import { AppPermissions } from '@/app/auth/permissions/app.permission';
import { IdentityProvider } from '@/types/user';
import { CapitalizeTransformer } from '@/utils/transformers/capitalize';

import * as bcrypt from 'bcrypt';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

@Entity()
export class User extends Timestamp {
	@Column({
		type: 'enum',
		enum: IdentityProvider,
		nullable: true,
		select: false,
	})
	identityProvider: IdentityProvider | null;

	@Column({
		type: String,
		unique: true,
		nullable: true,
		select: false,
	})
	identityProviderId: string | null;

	@Column({ unique: true })
	email: string;

	@Column({ type: String, select: false, nullable: true })
	password: string | null;

	@Column({
		transformer: new CapitalizeTransformer(),
	})
	firstName: string;

	@Column({
		transformer: new CapitalizeTransformer(),
	})
	lastName: string;

	@Column({ type: 'text', array: true, default: [] })
	permissions: AppPermissions[];

	@Column({
		type: String,
		nullable: true,
		unique: true,
		select: false,
	})
	emailVerificationToken: string | null;

	@Column({ default: false })
	emailVerified: boolean;

	@BeforeInsert()
	@BeforeUpdate()
	private async hashPassword() {
		if (this.password) {
			const salt = await bcrypt.genSalt(10);

			this.password = bcrypt.hashSync(this.password, salt);
		}
	}

	public async matchPassword(enteredPassword: string) {
		return await bcrypt.compare(enteredPassword, this.password!);
	}
}
