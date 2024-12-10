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
import { FastifyReply as Response } from 'fastify';
import { LoginRequest } from '../dto/request/auth/loginRequest';
import { RegisterRequest } from '../dto/request/auth/registerRequest';
import { CommonResponse } from '../dto/response/commonResponse';
import { RegisterResponse } from '../dto/response/RegisterResponse';
import { AuthService } from './auth.service';
import { LoginResponse } from '../dto/response/LoginResponse';
import { AuthGuard } from '../security/authGuard';
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
      res.setCookie('jwt', loginResponse.token, {
        httpOnly: true, // Make cookie accessible only by HTTP requests
        path: '/', // Path where cookie is accessible (default to root '/')
        maxAge: 1000 * 60 * 60 * 24, // Cookie expiration time (e.g., 1 day)
      });
      const commonResponse = new CommonResponse(
        'Login Successfully',
        HttpStatus.ACCEPTED,
        null,
      );
      res.code(commonResponse.statusCode).send(commonResponse);
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
      res.code(commonResponse.statusCode).send(commonResponse);
    } catch (error) {
      handleException(error, res);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/logout')
  async logout(@Request() req: any, @Res() res: Response): Promise<void> {
    try {
      res.clearCookie('jwt');
      const commonResponse = new CommonResponse(
        'Logged out successfully',
        HttpStatus.OK,
        null,
      );
      res.code(commonResponse.statusCode).send(commonResponse);
    } catch (error) {
      handleException(error, res);
    }
  }

  @Get('/user-info')
  @UseGuards(AuthGuard)
  UserInfo(@Request() request: any) {
    const { username, name } = request.user;
    return { username, name };
  }
}
