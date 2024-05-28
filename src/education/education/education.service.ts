import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import { Prisma } from '@prisma/client';
import { v4 } from 'uuid';

@Injectable()
export class EducationService {
  constructor(private readonly prisma: PrismaService) {}

  async bulkUpdateEducation(request: any): Promise<Prisma.BatchPayload> {
    try {
      const data = request.map((item: any) => ({
        uuid: item.uuid,
        data: item.data,
      }));

      return await this.prisma.education.updateMany({
        where: { uuid: data.uuid },
        data: data.data,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async bulkAddEducation(request: any): Promise<Prisma.BatchPayload> {
    try {
      const data = request.map((item: any) => ({
        uuid: v4(),
        title: item.title,
        from: item.from,
        profileUuid: item.profileUuid,
      }));

      return await this.prisma.education.createMany({
        data,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async bulkRemoveEducation(request: any): Promise<Prisma.BatchPayload> {
    try {
      const data = request.map((item: any) => ({
        uuid: item.uuid,
      }));

      return await this.prisma.education.deleteMany({
        where: { uuid: data },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
