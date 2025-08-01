import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  Get,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { LoginRequest } from '../dto/request/auth/loginRequest';
import { RegisterRequest } from '../dto/request/auth/registerRequest';
import { CommonResponse } from '../dto/response/commonResponse';
import { RegisterResponse } from '../dto/response/RegisterResponse';
import { AuthService } from './auth.service';
import { LoginResponse } from '../dto/response/LoginResponse';
import { AuthGuard } from '../security/authGuard';
import { handleException } from '../utils/handleException';
import { Response, Request } from 'express';
import { User } from '../../prisma/generated/client';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() request: LoginRequest, @Res({ passthrough: true }) res: Response) {
    try {
      const loginResponse: LoginResponse = await this.authService.validateUser(request);
      (res as any).cookie('jwt', loginResponse.token, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24,
      });
      return new CommonResponse('Login Successful', HttpStatus.OK, loginResponse);
    } catch (error) {
      return handleException(error.message);
    }
  }

  @Post('/register')
  async register(
    @Body(new ValidationPipe({ transform: true })) request: RegisterRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const registerResponse: RegisterResponse = await this.authService.addUser(request);
      return new CommonResponse('Login Successful', HttpStatus.OK, registerResponse);
    } catch (error) {
      return handleException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    try {
      (res as any).clearCookie('jwt', {
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });
      return new CommonResponse('Login Successful', HttpStatus.OK, null);
    } catch (error) {
      return handleException(error.message);
    }
  }

  @Get('/user-info')
  @UseGuards(AuthGuard)
  UserInfo(@Req() request: Request) {
    const user = request['user'] as User;
    const { username, name } = user;
    return new CommonResponse('Welcome', HttpStatus.OK, { username, name });
  }
}
