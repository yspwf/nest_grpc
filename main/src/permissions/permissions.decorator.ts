import { SetMetadata } from '@nestjs/common';

export const CHECK_PERMISSIONS_KEY = 'check_permissions';

export const CheckPermissions = (resource: string, action: string) =>
  SetMetadata(CHECK_PERMISSIONS_KEY, { resource, action });