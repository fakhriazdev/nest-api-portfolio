import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
  Request,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '../security/authGuard';
import { EducationService } from './education.service';
import { Education } from '@prisma/client';
import { Response } from 'express';
import { CommonResponse } from '../dto/response/commonResponse';
import { handleException } from '../utils/handleException';
import { UpdateEducationRequest } from '../dto/request/UpdateEducationRequest';
import { DeleteEducationRequest } from '../dto/request/deleteEducationRequest';
import { AddEducationRequest } from '../dto/request/AddEducationRequest';

@Controller('educations')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}
  @UseGuards(AuthGuard)
  @Post('/add')
  async createEducation(
    @Body(new ValidationPipe({ transform: true }))
    requests: AddEducationRequest[],
    @Request() req: any,
    @Res() res: Response,
  ) {
    // const { username } = req.user;
    try {
      const response: Education[] =
        await this.educationService.bulkAddEducation(requests);
      const commonResponse: CommonResponse<Education[]> = new CommonResponse(
        'Create Educations Successfully',
        HttpStatus.OK,
        response,
      );
      res.status(commonResponse.statusCode).json(commonResponse);
    } catch (error) {
      handleException(error, res);
    }
  }
  @UseGuards(AuthGuard)
  @Get('/')
  async getAllEducations(@Res() res: Response) {
    try {
      const educationsResponse: Education[] =
        await this.educationService.getEducations();
      const commonResponse = new CommonResponse(
        'Get Education Successfully',
        HttpStatus.OK,
        educationsResponse,
      );
      res.status(commonResponse.statusCode).json(commonResponse);
    } catch (error) {
      handleException(error, res);
    }
  }
  @Delete('/delete')
  @UseGuards(AuthGuard)
  async deleteEducations(
    @Body(new ValidationPipe({ transform: true }))
    requests: DeleteEducationRequest[],
    @Request() req: any,
    @Res() res: Response,
  ) {
    const { username } = req.user;
    try {
      const responseDeleteEducation: string =
        await this.educationService.bulkRemoveEducation(requests, username);
      const commonResponse: CommonResponse<string> = new CommonResponse(
        'Delete Educations Successfully',
        HttpStatus.OK,
        responseDeleteEducation,
      );
      res.status(commonResponse.statusCode).json(commonResponse);
    } catch (error) {
      handleException(error, res);
    }
  }
  @Patch('/update')
  async updateEducations(
    @Body(new ValidationPipe({ transform: true }))
    requests: UpdateEducationRequest[],
    @Request() req: any,
    @Res() res: Response,
  ) {
    const { username } = req.user;
    try {
      const responseBulkUpdateEducation: Education[] =
        await this.educationService.bulkUpdateEducation(requests, username);
      const commonResponse: CommonResponse<Education[]> = new CommonResponse(
        'Update Educations Successfully',
        HttpStatus.OK,
        responseBulkUpdateEducation,
      );
      res.status(commonResponse.statusCode).json(commonResponse);
    } catch (error) {
      handleException(error, res);
    }
  }
}
