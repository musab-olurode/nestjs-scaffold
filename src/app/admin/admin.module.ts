import { Module } from '@nestjs/common';

import { UsersModule } from '@/app/users/users.module';

import { AdminController } from '@/app/admin/admin.controller';

@Module({
	imports: [UsersModule],
	controllers: [AdminController],
})
export class AdminModule {}
