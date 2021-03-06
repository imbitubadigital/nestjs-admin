import { AuthService } from './auth.service';
import { UserService } from './../user/user.service';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './models/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { AuthGuard } from './auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const hashed = await bcrypt.hash(body.password, 12);
    if (body.password !== body.password_confirm) {
      throw new BadRequestException(
        'Senha e a repetição da senha não conferem',
      );
    }

    delete body.password_confirm;

    return this.userService.create({
      ...body,
      password: hashed,
      role: { id: 2 },
    });
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.userService.findOne({ email });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado!');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Email e/ou senha não conferem!');
    }

    const jwt = await this.jwtService.signAsync({ id: user.id });

    response.cookie('jwt', jwt, { httpOnly: true });

    return user;
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async user(@Req() request: Request) {
    const id = await this.authService.userId(request);
    return this.userService.findOne({ id });
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return { message: 'Success' };
  }
}
