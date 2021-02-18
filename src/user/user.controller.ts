import { AuthService } from './../auth/auth.service';
import { PaginatedResult } from './../common/paginated-result.interface';
import { UserService } from './user.service';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from './models/user.entity';
import * as bcrypt from 'bcryptjs';
import { UserCreateDto } from './models/user-create.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserUpdateDto } from './models/user-update.dto';
import { Request } from 'express';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

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

  @Put('info')
  async updateInfo(@Req() request: Request, @Body() body: UserUpdateDto) {
    const id = await this.authService.userId(request);
    await this.userService.update(id, body);
    return this.userService.findOne({ id });
  }

  @Put('password')
  async updatePassword(
    @Req() request: Request,
    @Body('password') password: string,
    @Body('password_confirm') password_confirm: string,
  ) {
    if (password !== password_confirm) {
      throw new BadRequestException(
        'Senha e a repetição da senha não conferem',
      );
    }
    const hashed = await bcrypt.hash(password, 12);
    const id = await this.authService.userId(request);
    await this.userService.update(id, { password: hashed });
    return this.userService.findOne({ id });
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
