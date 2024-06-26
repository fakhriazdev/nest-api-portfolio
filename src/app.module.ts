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
import { ConfigModule } from '@nestjs/config';
import { EducationService } from './education/education.service';
import { EducationController } from './education/education.controller';
import { EducationModule } from './education/education.module';
import { TechnologyService } from './technology/technology.service';
import { TechnologyModule } from './technology/technology.module';
import { TechnologyController } from './technology/technology.controller';
import { ProjectModule } from './project/project.module';
import * as cookieParser from 'cookie-parser';
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
    TechnologyModule,
    ProjectModule,
  ],
  controllers: [
    AuthController,
    ProfileController,
    ProjectController,
    EducationController,
    TechnologyController,
  ],
  providers: [
    AuthService,
    PrismaService,
    LocalStrategy,
    JwtStrategy,
    ProfileService,
    ProjectService,
    EducationService,
    TechnologyService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser())
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
