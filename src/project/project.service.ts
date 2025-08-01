import { ProfileService } from '../profile/profile.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectRequest } from '../dto/request/project/projectRequest';
import { Project, Stack } from '../../prisma/generated/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProjectService {
  constructor(
    private readonly profileService: ProfileService,
    private readonly prisma: PrismaService,
  ) {}

  private readonly stackMap: Record<string, Stack> = {
    fullstack: Stack.FULLSTACK,
    frontend: Stack.FRONTEND,
    backend: Stack.BACKEND,
  };

  async addProject(request: ProjectRequest, username: string): Promise<Project> {
    const stack = this.getStackEnumFromString(request.stack);
    const profile = await this.profileService.getOneByUser(username);

    if (profile.userId !== username) {
      throw new UnauthorizedException();
    }

    return this.prisma.project.create({
      data: {
        uuid: uuidv4(),
        title: request.title,
        description: request.description,
        stack,
        profileUuid: profile.uuid,
        userId: username,
        createdAt: new Date(), // atau biarkan Prisma handle default-nya
      },
    });
  }

  async getDetailProject(uuid: string): Promise<Project> {
    return this.prisma.project.findUniqueOrThrow({
      where: { uuid },
      include: {
        technology: true,
        comments: true,
        likes: true,
        profile: true,
        user: true, // jika relasi ada di schema
      },
    });
  }

  private getStackEnumFromString(stackString: string): Stack {
    const stack = this.stackMap[stackString.toLowerCase()];
    if (!stack) throw new Error(`Invalid stack value: ${stackString}`);
    return stack;
  }
}
