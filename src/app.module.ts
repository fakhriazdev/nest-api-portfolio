import {  Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProfileModule } from './profile/profile.module';
import { ProjectModule } from './project/project.module';
import { EducationModule } from './education/education.module';
import { CommentsModule } from './comments/comments.module';
import { TechnologyModule } from './technology/technology.module';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    AuthModule,
    ProfileModule,
    EducationModule,
    TechnologyModule,
    ProjectModule,
    CommentsModule,
  ],
  controllers: [
  AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {}
