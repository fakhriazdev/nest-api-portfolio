import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { AuthGuard } from '../security/authGuard';
import { ProjectRequest } from '../dto/request/project/projectRequest';
import { Response } from 'express';
import { Project } from '@prisma/client';
import { CommonResponse } from '../dto/response/commonResponse';
import { handleException } from '../utils/handleException';

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
      handleException(error, res);
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
      handleException(error, res);
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
      handleException(error, res);
    }
  }

  @Get('/:uuid')
  @UseGuards(AuthGuard)
  async getProjectById(@Param('uuid') uuid: string, @Res() res: Response) {
    try {
      const responseGetProject: Project =
        await this.projectService.getProject(uuid);
      const commonResponse: CommonResponse<Project> = new CommonResponse(
        'Get Project Successfully',
        HttpStatus.OK,
        responseGetProject,
      );
      res.status(commonResponse.statusCode).json(commonResponse);
    } catch (error) {
      handleException(error, res);
    }
  }
}
