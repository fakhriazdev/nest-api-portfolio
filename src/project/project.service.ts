import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { v4 } from 'uuid';
import { ProjectRequest } from '../dto/request/project/projectRequest';
import { $Enums, Project, Stack } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async addProject(request: ProjectRequest, username: any): Promise<Project> {
    const stack: $Enums.Stack = this.getStackEnumFromString(request.stack);
    const project: Project = await this.prisma.project.create({
      data: {
        uuid: v4(),
        title: request.title,
        stack,
        userId: username,
      },
    });
    return project;
  }
  async getAllProjects(): Promise<Project[]> {
    const Projects: Project[] = await this.prisma.project.findMany({
      include: {
        technology: true,
      },
    });
    return Projects;
  }
  async updateProject(
    uuid: string,
    request: ProjectRequest,
    username: any,
  ): Promise<Project> {
    const { title, stack } = request;
    const Estack: $Enums.Stack = this.getStackEnumFromString(stack);
    const data: Project = await this.prisma.project.findUnique({
      where: {
        uuid,
      },
    });
    if (!data || data.userId !== username) {
      throw new UnauthorizedException(
        'You are not authorized to update this project.',
      );
    }
    const updatedProject: Project = await this.prisma.project.update({
      where: {
        uuid,
      },
      data: {
        title,
        stack: Estack,
        userId: username,
      },
    });

    return updatedProject;
  }

  private getStackEnumFromString(stackString: string): Stack {
    switch (stackString.toLowerCase()) {
      case 'fullstack':
        return Stack.FULLSTACK;
      case 'frontend':
        return Stack.FRONTEND;
      case 'backend':
        return Stack.BACKEND;
      default:
        throw new Error('Invalid stack value');
    }
  }
}
