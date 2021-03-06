import { PermissionService } from './permission.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Permission } from './permission.entity';
import { HasPermission } from './has-permisson.dedorator';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  async all(): Promise<Permission[]> {
    return this.permissionService.all();
  }
}
