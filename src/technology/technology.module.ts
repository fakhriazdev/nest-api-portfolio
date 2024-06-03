import { Module } from '@nestjs/common';
import { TechnologyService } from './technology.service';
import { PrismaService } from '../db/prisma.service';
import { ProjectService } from '../project/project.service';

@Module({
  providers: [TechnologyService, PrismaService, ProjectService],
})
export class TechnologyModule {}
