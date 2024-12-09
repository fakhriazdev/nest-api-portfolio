import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretKey: process.env.SECRET_KEY || 'hidden',
      issuer: process.env.ISSUER_STAMP,
    });
  }

  async validate(payload: any) {
    return { userId: payload.username, username: payload.name };
  }
}
