import { PermissionService } from './permission.service';
import { Controller, Get } from '@nestjs/common';
import { Permission } from './permission.entity';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  async all(): Promise<Permission[]> {
    return this.permissionService.all();
  }
}
