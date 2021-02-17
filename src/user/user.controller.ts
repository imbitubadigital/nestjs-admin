import { PaginatedResult } from './../common/paginated-result.interface';
import { UserService } from './user.service';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from './models/user.entity';
import * as bcrypt from 'bcryptjs';
import { UserCreateDto } from './models/user-create.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserUpdateDto } from './models/user-update.dto';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async all(@Query('page') page = '1') {
    return await this.userService.paginate(Number(page), ['role']);
  }

  @Post()
  async create(@Body() body: UserCreateDto): Promise<User> {
    const passwordHash = await bcrypt.hash('123456', 12);
    const { role_id, ...res } = body;
    return this.userService.create({
      ...res,
      password: passwordHash,
      role: { id: role_id },
    });
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.findOne({ id: Number(id) }, ['role']);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UserUpdateDto) {
    const intId = Number(id);
    const { role_id, ...rest } = body;
    await this.userService.update(intId, { ...rest, role: { id: role_id } });

    return this.userService.findOne({ id: intId });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(Number(id));
  }
}
