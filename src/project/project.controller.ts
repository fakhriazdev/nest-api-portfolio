import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException, Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  Res,
  UseGuards
} from "@nestjs/common";
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
      this.handleException(error, res);
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  async getProjects(@Res() res: Response) {
    try {
      const projectsResponse: any = await this.projectService.getAllProjects();
      const commonResponse = new CommonResponse(
        'Get Projects Successfully',
        HttpStatus.OK,
        projectsResponse,
      );
      res.status(commonResponse.statusCode).json(commonResponse);
    } catch (error) {
      this.handleException(error, res);
    }
  }

  @Patch('/:uuid')
  @UseGuards(AuthGuard)
  async updateProjectById(
    @Request() request: any,
    @Param('uuid') uuid: string,
    @Body() projectRequest: ProjectRequest,
    @Res() res: Response,
  ) {
    const { username } = request.user;

    try {
      const responseUpdateProjectById = await this.projectService.updateProject(
        uuid,
        projectRequest,
        username,
      );
      const commonResponse = new CommonResponse(
        'Update Project Successfully',
        HttpStatus.OK,
        responseUpdateProjectById,
      );
      res.status(commonResponse.statusCode).json(commonResponse);
    } catch (error) {
      this.handleException(error, res);
    }
  }

  private handleException(error: any, res: Response) {
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (error instanceof ConflictException) {
      statusCode = HttpStatus.CONFLICT;
      message = error.message;
    } else if (error instanceof ForbiddenException) {
      statusCode = HttpStatus.FORBIDDEN;
      message = error.message;
    }

    const commonResponse = new CommonResponse(message, statusCode, null);
    res.status(commonResponse.statusCode).json(commonResponse);
  }
}
