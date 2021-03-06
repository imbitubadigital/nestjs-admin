import { RoleService } from './role.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { HasPermission } from 'src/permission/has-permisson.dedorator';

@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get()
  @HasPermission('roles')
  async all() {
    return this.roleService.all();
  }

  @Post()
  @HasPermission('roles')
  async create(@Body('name') name: string, @Body('permissions') ids: number[]) {
    return this.roleService.create({
      name,
      permissions: ids.map((id) => ({ id })),
    });
  }

  @Get(':id')
  @HasPermission('roles')
  async getUser(@Param('id') id: string) {
    return this.roleService.findOne({ id: Number(id) }, ['permissions']);
  }

  @Put(':id')
  @HasPermission('roles')
  async update(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('permissions') ids: number[],
  ) {
    const intId = Number(id);
    await this.roleService.update(intId, { name });

    const role = await this.roleService.findOne({ id: intId });

    return this.roleService.create({
      ...role,
      permissions: ids.map((id) => ({ id })),
    });
  }

  @Delete(':id')
  @HasPermission('roles')
  async delete(@Param('id') id: string) {
    return this.roleService.delete(Number(id));
  }
}
