import { forwardRef, Module } from '@nestjs/common';
import { ProfileModule } from '../profile/profile.module';
@Module({
  imports: [forwardRef(() => ProfileModule)],
})
export class EducationModule {}
