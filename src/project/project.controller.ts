import {
  Body,
  ConflictException,
  Controller,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { AuthGuard } from '../security/authGuard';
import { ProjectRequest } from '../dto/request/projectRequest';
import { Response } from 'express';
import { Project } from '@prisma/client';
import { CommonResponse } from '../dto/response/commonResponse';

@Controller('/api/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createProject(
    @Request() request: any,
    @Body() projectRequest: ProjectRequest,
    @Res() res: Response,
  ) {
    const { username } = request.user;
    try {
      const getAddProjectResponse: Project =
        await this.projectService.addProject(projectRequest, username);
      const commonResponse = new CommonResponse(
        'Create Project Successfully',
        HttpStatus.CREATED,
        getAddProjectResponse,
      );
      res.status(commonResponse.statusCode).json(commonResponse);
    } catch (error) {
      if (error instanceof ConflictException) {
        const commonResponse = new CommonResponse(
          error.message,
          HttpStatus.CONFLICT,
          null,
        );
        res.status(commonResponse.statusCode).json(commonResponse);
      } else {
        const commonResponse = new CommonResponse(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
        );
        res.status(commonResponse.statusCode).json(commonResponse);
      }
    }
  }
}
