import { forwardRef, Module } from '@nestjs/common';
import { EducationModule } from '../education/education.module';

@Module({
  imports: [forwardRef(() => EducationModule)],
})
export class ProfileModule {}
