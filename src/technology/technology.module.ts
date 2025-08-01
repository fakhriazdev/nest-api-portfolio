import { forwardRef, Module } from '@nestjs/common';
import { TechnologyService } from './technology.service';
import { ProjectModule } from '../project/project.module';


@Module({
  imports: [
    forwardRef(() => ProjectModule), // Import ProjectModule dengan forwardRef jika ada referensi silang
  ],
  providers: [TechnologyService],
  exports: [TechnologyService],
})
export class TechnologyModule {}
