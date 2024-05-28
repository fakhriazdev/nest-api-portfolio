import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { v4 } from 'uuid';
import { ProjectRequest } from '../dto/request/projectRequest';
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
