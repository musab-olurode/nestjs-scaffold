import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@/app/users/entities/user.entity';

import { UsersController } from '@/app/users/users.controller';

import { UsersService } from '@/app/users/users.service';
import { WinstonLoggerService } from '@/logger/winston-logger/winston-logger.service';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	controllers: [UsersController],
	providers: [UsersService, WinstonLoggerService],
	exports: [UsersService],
})
export class UsersModule {}
