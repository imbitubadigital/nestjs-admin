import { UserService } from './user.service';
import { Controller, Get } from '@nestjs/common';
import { User } from './models/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async all(): Promise<User[]> {
    return this.userService.all();
  }
}
