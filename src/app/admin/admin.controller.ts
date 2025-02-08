import { Controller, Get } from '@nestjs/common';

import { RequirePermissions } from '@/app/auth/guards/permissions.guard';

import { UsersService } from '@/app/users/users.service';

import { AppPermissions } from '@/app/auth/permissions/app.permission';

import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('admin')
export class AdminController {
	constructor(private readonly usersService: UsersService) {}

	@RequirePermissions(AppPermissions.READ_USERS)
	@Get('users')
	findAll(@Paginate() query: PaginateQuery) {
		return this.usersService.findAll(query);
	}
}
