import { SetMetadata } from '@nestjs/common';
import { AppPermissions } from '../permissions/app.permission';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: AppPermissions[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
