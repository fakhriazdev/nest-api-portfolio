import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

import { JwtStrategy } from './security/jwt.strategy';
import { LocalStrategy } from './security/local.strategy';
import { PrismaService } from './db/prisma.service';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';
import { ProfileModule } from './profile/profile.module';
import { ProjectController } from './project/project.controller';
import { ProjectService } from './project/project.service';
import * as cookieParser from 'cookie-parser';
import { ConfigModule } from '@nestjs/config';
import { EducationService } from './education/education/education.service';
import { EducationController } from './education/education/education.controller';
import { EducationModule } from './education/education/education.module';
@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: {
        expiresIn: '30d',
        issuer: process.env.ISSUER_STAMP,
      },
    }),
    ProfileModule,
    EducationModule,
  ],
  controllers: [
    AuthController,
    ProfileController,
    ProjectController,
    EducationController,
  ],
  providers: [
    AuthService,
    PrismaService,
    LocalStrategy,
    JwtStrategy,
    ProfileService,
    ProjectService,
    EducationService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser())
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
