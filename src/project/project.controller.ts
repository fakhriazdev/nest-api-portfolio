import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { AuthGuard } from '../security/authGuard';
import { ProjectRequest } from '../dto/request/project/projectRequest';
import { Response } from 'express';
import { Project } from '@prisma/client';
import { CommonResponse } from '../dto/response/commonResponse';
import { handleException } from '../utils/handleException';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('/api/')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('project')
  @UseGuards(AuthGuard)
  async createProject(
    @Req() request: any,
    @Body() projectRequest: ProjectRequest,
    @Res() res: Response,
  ) {
    const { username } = request.user;
    try {
      const getAddProjectResponse: Project =
        await this.projectService.addProject(projectRequest, username);
      return new CommonResponse(
        'Create Project Successfully',
        HttpStatus.CREATED,
        getAddProjectResponse,
      );
    } catch (error) {
      handleException(error);
    }
  }

  @Get('projects')
  @UseGuards(AuthGuard)
  async getProjects(@Res() res: Response) {
    try {
      const projectsResponse: any = await this.projectService.getAllProjects();
      return new CommonResponse(
        'Get Projects Successfully',
        HttpStatus.OK,
        projectsResponse,
      );
    } catch (error) {
      handleException(error);
    }
  }

  // @Post('project/upload')
  // @UseGuards(AuthGuard)
  // @UseInterceptors(FilesInterceptor('file'))
  // async uploadImage(@UploadedFiles() file, @Res() res: Response) {
  //   try {
  //     const responseUploadImage = await this.projectService.addImage(file);
  //     return new CommonResponse(
  //       'Get Projects Successfully',
  //       HttpStatus.OK,
  //       responseUploadImage,
  //     );
  //   } catch (error) {
  //     handleException(error, res);
  //   }
  // }

  @Patch('project/:uuid')
  @UseGuards(AuthGuard)
  async updateProjectById(
    @Req() request: any,
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
      return new CommonResponse(
        'Update Project Successfully',
        HttpStatus.OK,
        responseUpdateProjectById,
      );
    } catch (error) {
      handleException(error);
    }
  }

  @Get('project/detail/:uuid')
  @UseGuards(AuthGuard)
  async getDetailProjectById(
    @Param('uuid') uuid: string,
    @Res() res: Response,
  ) {
    try {
      const responseGetProject: Project =
        await this.projectService.getDetailProject(uuid);
      const commonResponse: CommonResponse<Project> = new CommonResponse(
        'Get Project Successfully',
        HttpStatus.OK,
        responseGetProject,
      );
    } catch (error) {
      handleException(error);
    }
  }

  @Get('projects/user')
  @UseGuards(AuthGuard)
  async getProjectsByUserId(@Req() request: any, @Res() res: Response) {
    const { username } = request.user;
    try {
      const responseGetProject: Project[] =
        await this.projectService.getProjectsByUserId(username);
      const commonResponse: CommonResponse<Project[]> = new CommonResponse(
        'Get Projects Successfully',
        HttpStatus.OK,
        responseGetProject,
      );
    } catch (error) {
      handleException(error);
    }
  }
}
