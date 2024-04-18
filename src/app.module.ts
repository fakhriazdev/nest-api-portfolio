import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { jwtConstants } from './security/constants';
import { JwtStrategy } from './security/jwt.strategy';
import { LocalStrategy } from './security/local.strategy';
import { PrismaService } from './db/prisma.service';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';
import { ProfileModule } from './profile/profile.module';
import { CaslModule } from './casl/casl.module';

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
    ProfileModule,
    CaslModule,
],
  controllers: [ AuthController, ProfileController],
  providers: [ AuthService,PrismaService,LocalStrategy,JwtStrategy, ProfileService],
})
export class AppModule {}
