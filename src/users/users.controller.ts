import { Controller, Post, Body, Res, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response, query } from 'express';
import { ConfigService } from '@nestjs/config';
@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {}

  @Post('/register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.usersService.register(createUserDto);
    res.cookie('token', token, {
      maxAge: Number(this.config.get('COOKIE_MAX_AGE')),
      httpOnly: true,
      secure: true,
    });
    return { success: true };
  }

  @Post('/login')
  async login(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.usersService.login(createUserDto);
    // res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    // res.setHeader('access-control-allow-credentials', 'true');
    res.cookie('token', token, {
      maxAge: Number(this.config.get('COOKIE_MAX_AGE')),
      httpOnly: true,
      secure: true,
    });
    return {
      success: true,
      userName: createUserDto.fullName,
      email: createUserDto.email,
    };
  }
  @Get('/logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('token', '');
  }

  @Get('/profile')
  getUserProfile(@Res({ passthrough: true }) res: Response) {
    return this.usersService.getProfile(res.locals.user);
  }
  @Get('/oauth/google/login')
  loginWithGoogle(@Res({ passthrough: true }) res: Response) {
    return this.usersService.loginWithGoogle();
  }
  @Get('/oauth/google/verify')
  async verifyGoogleLogin(
    @Query('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.usersService.verifyGoogleLogin(code);

    res.cookie('token', token, {
      maxAge: Number(this.config.get('COOKIE_MAX_AGE')),
      httpOnly: true,
      secure: true,
    });
    return { success: true, token };
  }
}
