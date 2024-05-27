import { Body, Controller, Param, Post, Req, Request, Res, UseGuards } from "@nestjs/common";
import { ProjectService } from './project.service';
import { AuthGuard } from '../security/authGuard';
import { ProjectRequest } from "../dto/request/projectRequest";
import { UpdateUserRequest } from "../dto/request/updateUserRequest";
import { Response } from "express";
import any = jasmine.any;

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createProject(
    @Param('id') id: string,
    @Body() updateData: UpdateUserRequest,
    @Request() req: any,

  ) {
    const { username } = req.user;
    return this.projectService.addProject(projectRequest, username:any);
  }
}
