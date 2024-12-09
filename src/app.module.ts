import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { CommentsController } from './comments/comments.controller';
import { JwtStrategy } from './security/jwt.strategy';
import { LocalStrategy } from './security/local.strategy';
import { PrismaService } from './db/prisma.service';
import { ProfileModule } from './profile/profile.module';
import { ProjectModule } from './project/project.module';
import { EducationModule } from './education/education.module';
import { CommentsModule } from './comments/comments.module';
import { TechnologyModule } from './technology/technology.module';
import { ProfileController } from './profile/profile.controller';
import { ProjectController } from './project/project.controller';
import { EducationController } from './education/education.controller';
import { TechnologyController } from './technology/technology.controller';
import * as cookieParser from 'cookie-parser';
import { AppService } from './app.service';

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
    CommentsModule,
  ],
  controllers: [
    AuthController,
    ProfileController,
    ProjectController,
    EducationController,
    TechnologyController,
    CommentsController,
  ],
  providers: [
    AuthService,
    PrismaService,
    LocalStrategy,
    JwtStrategy,
    AppService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser())
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
