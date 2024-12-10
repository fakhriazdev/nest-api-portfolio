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
import { FastifyReply as Response } from 'fastify';
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
    @Request() req: any,
    @Res() res: Response,
  ) {
    const { username } = req.user;
    try {
      const response: Education[] =
        await this.educationService.bulkAddEducation(requests, username);
      const commonResponse: CommonResponse<Education[]> = new CommonResponse(
        'Create Educations Successfully',
        HttpStatus.OK,
        response,
      );
      res.code(commonResponse.statusCode).send(commonResponse);
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
      res.code(commonResponse.statusCode).send(commonResponse);
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
      await this.educationService.bulkRemoveEducation(requests, username);
      const commonResponse: CommonResponse<string> = new CommonResponse(
        'Delete Educations Successfully',
        HttpStatus.OK,
        null,
      );
      res.code(commonResponse.statusCode).send(commonResponse);
    } catch (error) {
      handleException(error, res);
    }
  }
  @UseGuards(AuthGuard)
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
      res.code(commonResponse.statusCode).send(commonResponse);
    } catch (error) {
      handleException(error, res);
    }
  }
}
