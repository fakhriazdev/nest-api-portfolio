import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { Education } from '@prisma/client';
import { v4 } from 'uuid';
import { UpdateEducationRequest } from '../dto/request/UpdateEducationRequest';
import { DeleteEducationRequest } from '../dto/request/deleteEducationRequest';
import { AddEducationRequest } from '../dto/request/AddEducationRequest';
import { Profile } from '.prisma/client';
// import { ProfileService } from '../profile/profile.service';

@Injectable()
export class EducationService {
  constructor(private readonly prisma: PrismaService) {}
  async getEducation(uuid: string): Promise<Education> {
    return this.prisma.education.findFirstOrThrow({
      where: { uuid },
    });
  }
  async bulkUpdateEducation(
    request: UpdateEducationRequest[],
    username: string,
  ): Promise<Education[]> {
    try {
      return await this.prisma.$transaction(async (tPrisma) => {
        const educations: Promise<Education>[] = request.map(
          async (item: UpdateEducationRequest) => {
            try {
              const education: Education = await this.getEducation(item.uuid);
              if (education.profileUuid !== username) {
                throw new Error('unauthorized');
              }
              return await tPrisma.education.update({
                where: { uuid: item.uuid },
                data: item,
              });
            } catch (error) {
              throw new Error(error.message);
            }
          },
        );
        return await Promise.all(educations);
      });
    } catch (error) {
      throw error;
    }
  }
  async bulkAddEducation(request: AddEducationRequest[]): Promise<Education[]> {
    try {
      return await this.prisma.$transaction(async (tPrisma) => {
        const educations: Promise<Education>[] = request.map(
          async (item: AddEducationRequest) => {
            try {
              // const profile: Profile = await this.profileService.getOne(
              //   item.ProfileUuid,
              // );
              // if (profile.userId !== username) {
              //   throw new Error('unauthorized');
              // }
              return await tPrisma.education.create({
                data: {
                  uuid: v4(),
                  title: item.title,
                  from: item.from,
                  profileUuid: item.ProfileUuid,
                },
              });
            } catch (error) {
              throw new Error(error.message);
            }
          },
        );
        return await Promise.all(educations);
      });
    } catch (error) {
      throw error;
    }
  }
  async getEducations(): Promise<Education[]> {
    return this.prisma.education.findMany({});
  }
  async bulkRemoveEducation(
    request: DeleteEducationRequest[],
    username: string,
  ): Promise<string> {
    try {
      return await this.prisma.$transaction(async (tPrisma) => {
        const educations: Promise<Education>[] = request.map(
          async (item: UpdateEducationRequest) => {
            try {
              const education: Education = await this.getEducation(item.uuid);
              if (education.profileUuid !== username) {
                throw new Error('unauthorized');
              }
              return await tPrisma.education.delete({
                where: { uuid: item.uuid },
              });
            } catch (error) {
              throw new Error(error.message);
            }
          },
        );
        await Promise.all(educations);
        return 'Delete educations Successfully';
      });
    } catch (error) {
      throw error;
    }
  }
}
