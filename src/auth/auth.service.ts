

import { ConflictException, ConsoleLogger, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/db/prisma.service';
import { LoginRequest } from 'src/dto/request/loginRequest';
import { RegisterRequest } from 'src/dto/request/registerRequest';
import { LoginResponse } from 'src/dto/response/LoginResponse';
import { RegisterResponse } from 'src/dto/response/RegisterResponse';
import { encodePassord,comparePassword } from 'src/utils/Bcrypt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}


    async validateUser(request: LoginRequest):Promise<LoginResponse> {
        const findUser =  await this.prisma.user.findFirst({
            where: { username: request.username },
          })
          if (!findUser) {
            throw new UnauthorizedException('Bad Credential');
            }
    
            try {
                const isPasswordValid = await comparePassword(request.password, findUser.password);
                if (!isPasswordValid) {
                    throw new UnauthorizedException('Bad Credential');
                }
                const payload = { username: findUser.name, name: findUser.name };
                const token = this.jwtService.sign(payload);
                const loginResponse: LoginResponse = { token };
                return loginResponse;
            } catch (error) {
                throw new UnauthorizedException('Invalid credentials');
            }
        
    }

    async addUser(request: RegisterRequest): Promise<RegisterResponse> {
        const existingUser = await this.prisma.user.findUnique({
            where: {
                username: request.username,
            },
        });
        if (existingUser) {
            throw new ConflictException('Username already exists');
        }
        const generatedPw = await encodePassord(request.password);
        const newUser = await this.prisma.user.create({
            data: {
                username: request.username,
                password: generatedPw,
                name: request.name,
                profileUuid : null,
                
            },
        });

        if (!newUser) {
            throw new NotFoundException('Failed to create user');
        }

        const registerResponse: RegisterResponse = {
            username: newUser.username,
            name: newUser.name,
        };
        return registerResponse;
    }
        
      
}
