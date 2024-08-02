import { Module } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { ProjectService } from './project.service';
import { ProfileModule } from '../profile/profile.module';


@Module({
  imports: [ProfileModule],
  providers: [ProjectService, PrismaService],
  exports:[ProjectService]
})
export class ProjectModule {}
