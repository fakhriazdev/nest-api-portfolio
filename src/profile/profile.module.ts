import { forwardRef, Module } from '@nestjs/common';
import { EducationModule } from '../education/education.module';
import { ProfileService } from './profile.service';
import { PrismaService } from '../db/prisma.service';

@Module({
  imports: [forwardRef(() => EducationModule)],
  providers:[ProfileService,PrismaService],
  exports:[ProfileService]
})
export class ProfileModule {}
