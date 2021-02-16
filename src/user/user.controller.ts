import { UserService } from './user.service';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from './models/user.entity';
import * as bcrypt from 'bcryptjs';
import { UserCreateDto } from './models/user-create.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async all(): Promise<User[]> {
    return this.userService.all();
  }

  @Post()
  async create(@Body() body: UserCreateDto): Promise<User> {
    const passwordHash = await bcrypt.hash('123456', 12);
    return this.userService.create({
      ...body,
      password: passwordHash,
    });
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.findOne({ id: Number(id) });
  }
}
