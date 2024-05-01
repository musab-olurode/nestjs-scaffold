import { Controller, Get } from '@nestjs/common';
import { RequirePermissions } from '../auth/guards/permissions.guard';
import { AppPermissions } from '../auth/permissions/app.permission';
import { UsersService } from '../users/users.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly usersService: UsersService) {}

  @RequirePermissions(AppPermissions.READ_USERS)
  @Get('users')
  findAll() {
    return this.usersService.findAll();
  }
}
