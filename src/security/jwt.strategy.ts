import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY || 'secret',
      issuer: process.env.ISSUER_STAMP || 'fakhriganteng',
    });
  }

  async validate(payload: any) {
    return { userId: payload.username, username: payload.name };
  }
}
