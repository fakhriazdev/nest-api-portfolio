import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { Technology } from '@prisma/client';

@Injectable()
export class TechnologyService {
  constructor(private readonly prisma: PrismaService) {}

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
}
