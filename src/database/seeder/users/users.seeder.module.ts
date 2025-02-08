import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../../../app/users/entities/user.entity';

import { UsersSeederService } from './users.seeder.service';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [UsersSeederService],
	exports: [UsersSeederService],
})
export class UsersSeederModule {}
