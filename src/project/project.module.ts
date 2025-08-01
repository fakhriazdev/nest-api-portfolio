import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProfileModule } from '../profile/profile.module';


@Module({
  imports: [ProfileModule],
  providers: [ProjectService],
  exports:[ProjectService]
})
export class ProjectModule {}
