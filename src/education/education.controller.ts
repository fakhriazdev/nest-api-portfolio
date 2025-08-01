import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '../security/authGuard';
import { EducationService } from './education.service';
import { Education } from '@prisma/client';
import { Response, Request } from 'express';
import { CommonResponse } from '../dto/response/commonResponse';
import { handleException } from '../utils/handleException';
import { UpdateEducationRequest } from '../dto/request/education/UpdateEducationRequest';
import { DeleteEducationRequest } from '../dto/request/education/deleteEducationRequest';
import { AddEducationRequest } from '../dto/request/education/AddEducationRequest';

@Controller('/api/educations')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}
  @UseGuards(AuthGuard)
  @Post('/add')
  async createEducation(
    @Body(new ValidationPipe({ transform: true }))
    requests: AddEducationRequest[],
    @Req() req: any,
    @Res() res: Response,
  ) {
    const { username } = req.user;
    try {
      const response: Education[] =
        await this.educationService.bulkAddEducation(requests, username);
      return new CommonResponse('Create Educations Successfully',
        HttpStatus.OK,
        response,)
    } catch (error) {
      handleException(error);
    }
  }
  @UseGuards(AuthGuard)
  @Get('/')
  async getAllEducations(@Res() res: Response) {
    try {
      const educationsResponse: Education[] =
        await this.educationService.getEducations();
      return new CommonResponse('Get Education Successfully',
        HttpStatus.OK,
        educationsResponse)
    } catch (error) {
      handleException(error);
    }
  }
  @Delete('/delete')
  @UseGuards(AuthGuard)
  async deleteEducations(
    @Body(new ValidationPipe({ transform: true }))
    requests: DeleteEducationRequest[],
    @Req() req: any,
    @Res() res: Response,
  ) {
    const { username } = req.user;
    try {
      await this.educationService.bulkRemoveEducation(requests, username);
      return new CommonResponse(
        'Delete Educations Successfully',
        HttpStatus.OK,
        null,)
    } catch (error) {
      handleException(error);
    }
  }
  @UseGuards(AuthGuard)
  @Patch('/update')
  async updateEducations(
    @Body(new ValidationPipe({ transform: true }))
    requests: UpdateEducationRequest[],
    @Req() req: any,
    @Res() res: Response,
  ) {
    const { username } = req.user;
    try {
      const responseBulkUpdateEducation: Education[] =
        await this.educationService.bulkUpdateEducation(requests, username);
      return new CommonResponse(
        'Update Educations Successfully',
        HttpStatus.OK,
        responseBulkUpdateEducation)
    } catch (error) {
      handleException(error);
    }
  }
}
