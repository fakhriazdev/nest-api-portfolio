import { forwardRef, Module } from '@nestjs/common';
import { EducationModule } from '../education/education.module';
import { ProfileService } from './profile.service';

@Module({
  imports: [forwardRef(() => EducationModule)],
  providers:[ProfileService],
  exports:[ProfileService]
})
export class ProfileModule {}
