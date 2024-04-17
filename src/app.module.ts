import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { jwtConstants } from './security/constants';
import { JwtStrategy } from './security/jwt.strategy';
import { LocalStrategy } from './security/local.strategy';
import { PrismaService } from './db/prisma.service';

@Module({
  
  imports: [
    PassportModule,
    JwtModule.register({
        secret: jwtConstants.secret,
        signOptions: { 
          expiresIn: '30d',
          issuer: jwtConstants.issuer
         },
    }),
],
  controllers: [ AuthController],
  providers: [ AuthService,PrismaService,LocalStrategy,JwtStrategy],
})
export class AppModule {}
