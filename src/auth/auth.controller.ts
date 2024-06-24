import {
  Body,
  Controller,
  Request,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  Get,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { LoginRequest } from 'src/dto/request/auth/loginRequest';
import { RegisterRequest } from 'src/dto/request/auth/registerRequest';
import { CommonResponse } from 'src/dto/response/commonResponse';
import { RegisterResponse } from 'src/dto/response/RegisterResponse';
import { AuthService } from './auth.service';
import { LoginResponse } from 'src/dto/response/LoginResponse';
import { AuthGuard } from 'src/security/authGuard';
import { handleException } from '../utils/handleException';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Body(new ValidationPipe({ transform: true })) request: LoginRequest,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const loginResponse: LoginResponse =
        await this.authService.validateUser(request);
      res.cookie('jwt', loginResponse.token, { httpOnly: true });
      const commonResponse = new CommonResponse(
        'Login Successfully',
        HttpStatus.ACCEPTED,
        null,
      );
      res.status(commonResponse.statusCode).json(commonResponse);
    } catch (error) {
      handleException(error, res);
    }
  }

  @Post('/register')
  async register(
    @Body(new ValidationPipe({ transform: true })) request: RegisterRequest,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const registerResponse: RegisterResponse =
        await this.authService.addUser(request);
      const commonResponse = new CommonResponse(
        'Register Successfully',
        HttpStatus.CREATED,
        registerResponse,
      );
      res.status(commonResponse.statusCode).json(commonResponse);
    } catch (error) {
      handleException(error, res);
    }
  }

  @Get('user-info')
  @UseGuards(AuthGuard)
  UserInfo(@Request() request: any) {
    const { username, name } = request.user;
    return { username, name };
  }
}
