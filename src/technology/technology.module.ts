import { forwardRef, Module } from '@nestjs/common';
import { TechnologyService } from './technology.service';
import { PrismaService } from '../db/prisma.service';
import { ProjectModule } from '../project/project.module';


@Module({
  imports: [
    forwardRef(() => ProjectModule), // Import ProjectModule dengan forwardRef jika ada referensi silang
  ],
  providers: [TechnologyService, PrismaService],
  exports: [TechnologyService],
})
export class TechnologyModule {}
