import { Profile, User } from '../../prisma/generated/client';
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
    const user = await this.prisma.user.findUnique({
      where: { username: request.username },
    });

    if (!user || !(await comparePassword(request.password, user.password))) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = { username: user.username, name: user.name };
    const token = await this.jwtService.signAsync(payload);
    return { token };
  }


  async addUser(request: RegisterRequest): Promise<RegisterResponse> {
    return this.prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { username: request.username },
      });

      if (existingUser) {
        throw new ConflictException('Username already exists');
      }

      const hashedPassword = await encodePassord(request.password);

      const createdUser = await tx.user.create({
        data: {
          username: request.username,
          password: hashedPassword,
          name: request.name,
        },
      });

      await tx.profile.create({
        data: {
          uuid: v4(),
          image: null,
          title: null,
          bio: null,
          userId: createdUser.username,
        },
      });

      return {
        username: createdUser.username,
        name: createdUser.name,
      };
    });
  }

}
