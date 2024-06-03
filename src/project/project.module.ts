import { Module } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { ProjectService } from './project.service';

@Module({
  providers: [ProjectService, PrismaService],
})
export class ProjectModule {}
