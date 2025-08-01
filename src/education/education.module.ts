import { forwardRef, Module } from '@nestjs/common';
import { ProfileModule } from '../profile/profile.module';
import { EducationService } from './education.service';
@Module({
  imports: [forwardRef(() => ProfileModule)],
  providers: [EducationService],
  exports: [EducationService],
})
export class EducationModule {}
