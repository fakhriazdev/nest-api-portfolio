import { Controller, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../security/authGuard';
import { EducationService } from './education.service';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @UseGuards(AuthGuard)
  @Patch('/bulk')
  async bulkUpdateEducation(request: any) {

  }
}
