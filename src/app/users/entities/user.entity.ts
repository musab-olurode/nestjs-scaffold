import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IdentityProvider } from '../../../types/user';
import { CapitalizeTransformer } from '../../../utils/transformers/capitalize';
import { AppPermissions } from '../../auth/permissions/app.permission';
import { Timestamp } from '../../../database/entities/timestamp.entity';

@Entity()
export class User extends Timestamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'identity_provider',
    type: 'enum',
    enum: IdentityProvider,
    nullable: true,
    select: false,
  })
  identityProvider: IdentityProvider | null;

  @Column({
    name: 'identity_provider_id',
    unique: true,
    nullable: true,
    select: false,
  })
  identityProviderId: string | null;

  @Column({ unique: true })
  email: string;

  @Column({ select: false, nullable: true })
  password?: string;

  @Column({
    transformer: new CapitalizeTransformer(),
  })
  firstName: string;

  @Column({
    transformer: new CapitalizeTransformer(),
  })
  lastName: string;

  @Column({ type: 'simple-json', array: true })
  permissions: AppPermissions[];

  @Column({
    nullable: true,
    unique: true,
    select: false,
  })
  emailVerificationToken?: string | null;

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
    return await bcrypt.compare(enteredPassword, this.password);
  }
}
