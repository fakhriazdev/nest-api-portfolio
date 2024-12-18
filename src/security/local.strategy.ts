import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LoginRequest } from '../dto/request/auth/loginRequest';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(loginRequest: LoginRequest): Promise<any> {
    const user = await this.authService.validateUser(loginRequest);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
