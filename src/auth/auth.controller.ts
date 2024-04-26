import { Body, ConflictException, Controller, Request, HttpStatus, NotFoundException, Post, Res, UseGuards, Get } from '@nestjs/common';
import {Response } from 'express';
import { LoginRequest } from 'src/dto/request/loginRequest';
import { RegisterRequest } from 'src/dto/request/registerRequest';
import { CommonResponse } from 'src/dto/response/commonResponse';
import { RegisterResponse } from 'src/dto/response/RegisterResponse';
import { AuthService } from '../auth/auth.service';
import { LoginResponse } from 'src/dto/response/LoginResponse';
import { AuthGuard } from 'src/security/authGuard';

@Controller('/api/auth')
export class AuthController {

    constructor(private readonly authService:AuthService){}
    
    @Post('/login')
    async login(@Body() request: LoginRequest, @Res() res: Response): Promise<void> {
        try {
            const loginResponse:LoginResponse = await this.authService.validateUser(request);
            res.cookie('jwt',loginResponse.token,{httpOnly:true})
            const commonResponse = new CommonResponse('Login Successfully', HttpStatus.ACCEPTED,null);
            res.status(commonResponse.statusCode).json(commonResponse);
        } catch (error) {
            const commonResponse = new CommonResponse(error.message, HttpStatus.BAD_REQUEST, null);
            res.status(commonResponse.statusCode).json(commonResponse);
        }
    }
    @UseGuards(AuthGuard)
    @Post('/register')
    async register(@Body() request: RegisterRequest, @Res() res: Response): Promise<void> {
        try {
            const registerResponse: RegisterResponse = await this.authService.addUser(request);
            const commonResponse = new CommonResponse('Register Successfully', HttpStatus.CREATED, registerResponse);
            res.status(commonResponse.statusCode).json(commonResponse);
        } catch (error) {
            if (error instanceof ConflictException) {
                const commonResponse = new CommonResponse(error.message, HttpStatus.CONFLICT, null);
                res.status(commonResponse.statusCode).json(commonResponse);
            } else if (error instanceof NotFoundException) {
                const commonResponse = new CommonResponse(error.message, HttpStatus.NOT_FOUND, null);
                res.status(commonResponse.statusCode).json(commonResponse);
            } else {
                const commonResponse = new CommonResponse('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR, null);
                res.status(commonResponse.statusCode).json(commonResponse);
            }
        }
    }
    
    @Get('user-info')
    @UseGuards(AuthGuard)
    UserInfo(@Request() request:any) {
      const {username,name} = request.user
      return { username,name };
    }


}
