import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Project, Technology } from '../../prisma/generated/client';
import { RequestAddTechnology } from '../dto/request/technology/requestAddTechnology';
import { v4 } from 'uuid';
import { ProjectService } from '../project/project.service';
import { RequestUpdateTechnology } from '../dto/request/technology/requestUpdateTechnology';
import { RequestDeleteTechnology } from '../dto/request/technology/requestDeleteTechnology';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TechnologyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly projectService: ProjectService,
  ) {}

  async getAllTechnologies(): Promise<Technology[]> {
    return this.prisma.technology.findMany({});
  }

  async getTechnology(uuid: string): Promise<Technology> {
    return this.prisma.technology.findFirst({
      where: {
        uuid,
      },
    });
  }

  async addTechnology(
    request: RequestAddTechnology,
    userId: string,
  ): Promise<Technology> {
    const { name, image, projectId } = request;
    const project: Project =
      await this.projectService.getDetailProject(projectId);
    if (userId !== project.userId) {
      throw new UnauthorizedException();
    }
    return this.prisma.technology.create({
      data: {
        uuid: v4(),
        name,
        image,
        projectId,
        userId,
      },
    });
  }

  async updateTechnologyById(
    request: RequestUpdateTechnology,
    username: string,
  ): Promise<Technology> {
    const { uuid, name, image, projectId } = request;
    const project: Project =
      await this.projectService.getDetailProject(projectId);
    if (username !== project.userId) {
      throw new UnauthorizedException();
    }
    return this.prisma.technology.update({
      where: {
        uuid,
      },
      data: {
        uuid: v4(),
        name,
        image,
      },
    });
  }

  async deleteTechnology(
    request: RequestDeleteTechnology,
    username: string,
  ): Promise<void> {
    const { uuid, projectId } = request;
    const project: Project =
      await this.projectService.getDetailProject(projectId);
    if (username !== project.userId) {
      throw new UnauthorizedException();
    }
    try {
      this.prisma.technology.delete({ where: { uuid } });
    } catch (error) {
      throw new Error(error.message());
    }
  }
}
