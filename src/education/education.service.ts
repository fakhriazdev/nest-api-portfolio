import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Education,Profile } from '@prisma/client';
import { v4 } from 'uuid';
import { UpdateEducationRequest } from '../dto/request/education/UpdateEducationRequest';
import { DeleteEducationRequest } from '../dto/request/education/deleteEducationRequest';
import { AddEducationRequest } from '../dto/request/education/AddEducationRequest';
import { ProfileService } from '../profile/profile.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EducationService {
  constructor(
    @Inject(forwardRef(() => ProfileService))
    private readonly profileService: ProfileService,
    private readonly prisma: PrismaService,
  ) {}
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
              const profile: Profile = await this.profileService.getOne(
                item.profileUuid,
              );
              if (profile.userId === username && profile) {
                return await tPrisma.education.update({
                  where: { uuid: item.uuid },
                  data: {
                    uuid: v4(),
                    title: item.title,
                    from: item.from,
                    profileUuid: item.profileUuid,
                  },
                });
              } else {
                throw new Error('unauthorized');
              }
            } catch (error) {
              throw new Error(error.message);
            }
          },
        );
        return await Promise.all(educations);
      });
    } catch (error) {
      throw new Error(`Failed to update Education`);
    }
  }
  async bulkRemoveEducation(
    request: DeleteEducationRequest[],
    username: string,
  ): Promise<void> {
    try {
      await this.prisma.$transaction(async (tPrisma) => {
        await Promise.all(
          request.map(async (item: DeleteEducationRequest) => {
            try {
              const education: Education = await this.getEducation(item.uuid);
              const profile: Profile = await this.profileService.getOne(
                education.profileUuid,
              );
              if (profile.userId === username) {
                await tPrisma.education.delete({
                  where: { uuid: item.uuid },
                });
              } else {
                throw new Error('unauthorized');
              }
            } catch (error) {
              throw new Error(error.message);
            }
          }),
        );
      });
    } catch (error) {
      throw new Error(`Failed to update Education: ${error.message}`);
    }
  }

  async bulkAddEducation(
    request: AddEducationRequest[],
    username: string,
  ): Promise<Education[]> {
    try {
      return await this.prisma.$transaction(async (tPrisma) => {
        const educations: Promise<Education>[] = request.map(
          async (item: AddEducationRequest) => {
            try {
              const profile: Profile = await this.profileService.getOne(
                item.profileUuid,
              );
              if (profile.userId === username) {
                return await tPrisma.education.create({
                  data: {
                    uuid: v4(),
                    title: item.title,
                    from: item.from,
                    profileUuid: item.profileUuid,
                  },
                });
              } else {
                throw new Error('unauthorized');
              }
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
}
