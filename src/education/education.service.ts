import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AddEducationRequest } from '../dto/request/education/AddEducationRequest';
import { UpdateEducationRequest } from '../dto/request/education/UpdateEducationRequest';
import { DeleteEducationRequest } from '../dto/request/education/DeleteEducationRequest';
import { PrismaService } from '../prisma/prisma.service';
import { ProfileService } from '../profile/profile.service';
import { Education } from '../../prisma/generated/client';

@Injectable()
export class EducationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profileService: ProfileService,
  ) {}

  async getEducation(uuid: string): Promise<Education> {
    try {
      return await this.prisma.education.findFirstOrThrow({
        where: { uuid },
      });
    } catch {
      throw new NotFoundException('Education not found');
    }
  }

  async getEducations(): Promise<Education[]> {
    return this.prisma.education.findMany();
  }

  async bulkAddEducation(
    request: AddEducationRequest[],
    username: string,
  ): Promise<Education[]> {
    return this.prisma.$transaction(async (tx) => {
      const creations = request.map(async (item) => {
        const profile = await this.profileService.getOne(item.profileUuid);
        if (!profile || profile.userId !== username) {
          throw new UnauthorizedException();
        }

        return tx.education.create({
          data: {
            uuid: uuidv4(),
            title: item.title,
            from: item.from,
            profileUuid: item.profileUuid,
          },
        });
      });

      return Promise.all(creations);
    });
  }

  async bulkUpdateEducation(
    request: UpdateEducationRequest[],
    username: string,
  ): Promise<Education[]> {
    return this.prisma.$transaction(async (tx) => {
      const updates = request.map(async (item) => {
        const profile = await this.profileService.getOne(item.profileUuid);
        if (!profile || profile.userId !== username) {
          throw new UnauthorizedException();
        }

        return tx.education.update({
          where: { uuid: item.uuid },
          data: {
            title: item.title,
            from: item.from,
            profileUuid: item.profileUuid,
          },
        });
      });

      return Promise.all(updates);
    });
  }

  async bulkRemoveEducation(
    request: DeleteEducationRequest[],
    username: string,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const deletions = request.map(async (item) => {
        const education = await this.getEducation(item.uuid);
        const profile = await this.profileService.getOne(education.profileUuid);
        if (!profile || profile.userId !== username) {
          throw new UnauthorizedException();
        }

        return tx.education.delete({
          where: { uuid: item.uuid },
        });
      });

      await Promise.all(deletions);
    });
  }
}
