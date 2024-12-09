import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Request } from 'express';
import * as process from 'node:process';

const keys = {
  secret: process.env.SECRET_KEY,
  issuer: process.env.ISSUER_STAMP,
};
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { secret, issuer } = keys;
    const token = this.extractTokenFromCookie(request);
    const isValidSignature = await this.verifySignature(token, secret);
    if (!token) {
      throw new UnauthorizedException();
    }
    if (!isValidSignature) {
      throw new UnauthorizedException('Invalid token signature');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret,
        issuer,
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies['jwt'];
  }

  private async verifySignature(
    token: string,
    secret: string,
  ): Promise<boolean> {
    try {
      await this.jwtService.verifyAsync(token, { secret });
      return true;
    } catch {
      return false;
    }
  }
}
