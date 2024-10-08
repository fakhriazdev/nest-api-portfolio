import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { v4 } from 'uuid';
import { ProjectRequest } from '../dto/request/project/projectRequest';
import { $Enums, Project, Stack } from '@prisma/client';
import { put } from '@vercel/blob';
import { Profile } from '.prisma/client';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class ProjectService {
  constructor(
    private readonly profileService: ProfileService,
    private readonly prisma: PrismaService,
  ) {}
  async addImage(file) {
    try {
      if (!file) {
        throw new Error('No files uploaded');
      }
      return await put(file.filename(), file, {
        access: 'public',
        multipart: true,
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }
  async addProject(
    request: ProjectRequest,
    username: string,
  ): Promise<Project> {
    const stack: $Enums.Stack = this.getStackEnumFromString(request.stack);
    const profile: Profile = await this.profileService.getOneByUser(username);
    if (profile.userId !== username) {
      throw new UnauthorizedException();
    }
    const project: Project = await this.prisma.project.create({
      data: {
        uuid: v4(),
        title: request.title,
        stack,
        description: request.description,
        profileUuid: profile.uuid,
        userId: username,
        createdAt: new Date(),
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
    username: string,
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
  async getDetailProject(uuid: string): Promise<Project> {
    try {
      return this.prisma.project.findUnique({
        where: { uuid },
      });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getProjectsByUserId(userId: string): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: { userId },
      include:{
        comments: {
          select: {
            uuid: true,
          },
        },
      }
    });
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
