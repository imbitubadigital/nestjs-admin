import { PermissionService } from './permission.service';
import { Controller, Get } from '@nestjs/common';
import { Permission } from './permission.entity';
import { HasPermission } from './has-permisson.dedorator';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @HasPermission('view_permissions')
  async all(): Promise<Permission[]> {
    return this.permissionService.all();
  }
}
