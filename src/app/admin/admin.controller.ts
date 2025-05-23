import { Controller, Get, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@/app/auth/auth.guard';

import { UsersService } from '@/app/users/users.service';

import { Role } from '@/app/auth/decorators';

import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('admin')
@UseGuards(AuthGuard)
@Role('admin')
export class AdminController {
	constructor(private readonly usersService: UsersService) {}

	@Get('users')
	findAll(@Paginate() query: PaginateQuery) {
		return this.usersService.findAll(query);
	}
}
