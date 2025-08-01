import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  Get,
  ValidationPipe, Req,
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
import { User } from '@prisma/client';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Body(new ValidationPipe({ transform: true })) request: LoginRequest,
    @Res() res: Response,
  ){
    try {
      const loginResponse: LoginResponse =
        await this.authService.validateUser(request);
      res.cookie('jwt', loginResponse.token, {
        httpOnly: true, // Make cookie accessible only by HTTP requests
        path: '/', // Path where cookie is accessible (default to root '/')
        maxAge: 1000 * 60 * 60 * 24, // Cookie expiration time (e.g., 1 day)
      });
      const commonResponse = new CommonResponse(
        'Login Successfully',
        HttpStatus.ACCEPTED,
        null,
      );
      return new CommonResponse('Login Successful', HttpStatus.OK, loginResponse)
    } catch (error) {
      handleException(error);
    }
  }

  @Post('/register')
  async register(
    @Body(new ValidationPipe({ transform: true })) request: RegisterRequest,
    @Res() res: Response,
  ){
    try {
      const registerResponse: RegisterResponse =
        await this.authService.addUser(request);
      return new CommonResponse('Login Successful', HttpStatus.OK, registerResponse)
    } catch (error) {
      handleException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/logout')
  async logout(@Res({ passthrough: true }) res: Response){
    try {
      res.clearCookie('jwt');
      return new CommonResponse('Login Successful', HttpStatus.OK, null)
    } catch (error) {
      handleException(error);
    }
  }

  @Get('/user-info')
  @UseGuards(AuthGuard)
  UserInfo(@Req() request: Request) {
    const user = request['user'] as User;
    const { username,name } = user;
    return new CommonResponse('Welcome', HttpStatus.OK, { username, name });
  }
}
