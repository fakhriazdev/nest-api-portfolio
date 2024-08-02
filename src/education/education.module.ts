import { forwardRef, Module } from '@nestjs/common';
import { ProfileModule } from '../profile/profile.module';
import { EducationService } from './education.service';
import { PrismaService } from '../db/prisma.service';
@Module({
  imports: [forwardRef(() => ProfileModule)],
  providers: [EducationService,PrismaService],
  exports: [EducationService],
})
export class EducationModule {}
