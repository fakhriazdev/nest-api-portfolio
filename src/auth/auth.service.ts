import { Profile, User } from '@prisma/client';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginRequest } from '../dto/request/auth/loginRequest';
import { RegisterRequest } from '../dto/request/auth/registerRequest';
import { LoginResponse } from '../dto/response/LoginResponse';
import { RegisterResponse } from '../dto/response/RegisterResponse';
import { comparePassword, encodePassord } from '../utils/bcrypt';
import { v4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(request: LoginRequest): Promise<LoginResponse> {
    const findUser = await this.prisma.user.findFirst({
      where: { username: request.username },
    });
    if (!findUser) {
      throw new UnauthorizedException('Bad Credential');
    }

    try {
      const isPasswordValid = await comparePassword(
        request.password,
        findUser.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Bad Credential');
      }
      const payload = { username: findUser.username, name: findUser.name };
      const token = await this.jwtService.signAsync(payload);
      return { token };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async addUser(request: RegisterRequest): Promise<RegisterResponse> {
    try {
      const { newUser } = await this.prisma.$transaction(async (prisma) => {
        const existingUser = await prisma.user.findUnique({
          where: {
            username: request.username,
          },
        });

        if (existingUser) {
          throw new ConflictException('Username already exists');
        }

        const generatedPw = await encodePassord(request.password);
        const newUser: User = await prisma.user.create({
          data: {
            username: request.username,
            password: generatedPw,
            name: request.name,
          },
        });

        const newProfile: Profile = await prisma.profile.create({
          data: {
            uuid: v4(),
            image: null,
            title: null,
            bio: null,
            userId: newUser.username,
          },
        });

        return {
          newUser,
          newProfile,
        };
      });

      return {
        username: newUser.username,
        name: newUser.name,
      };
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
