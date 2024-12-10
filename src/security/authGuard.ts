import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify'; // Import FastifyRequest
import * as process from 'node:process';

const keys = {
  secret: process.env.SECRET_KEY,
  issuer: process.env.ISSUER_STAMP,
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>(); // Use FastifyRequest here
    const { secret, issuer } = keys;

    const token = this.extractTokenFromCookie(request);
    if (!token) {
      throw new UnauthorizedException('No token found');
    }

    const isValidSignature = await this.verifySignature(token, secret);
    if (!isValidSignature) {
      throw new UnauthorizedException('Invalid token signature');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret,
        issuer,
      });
      request['user'] = payload; // Attach the user to the request object
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }

  private extractTokenFromCookie(request: FastifyRequest): string | undefined {
    console.log(request); // This will show all cookies in the request
    return request.cookies['jwt']; // Extract the token from the cookies
  }

  private async verifySignature(
    token: string,
    secret: string,
  ): Promise<boolean> {
    try {
      await this.jwtService.verifyAsync(token, { secret });
      return true;
    } catch (error) {
      return false;
    }
  }
}
