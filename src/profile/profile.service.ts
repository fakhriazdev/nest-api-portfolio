import { Profile } from '@prisma/client';
import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { UpdateProfileRequest } from '../dto/request/auth/updateProfileRequest';
import { EducationService } from '../education/education.service';

@Injectable()
export class ProfileService {
  constructor(
    @Inject(forwardRef(() => EducationService))
    private readonly educationService: EducationService,
    private readonly prisma: PrismaService,
  ) {}

  async getAll(): Promise<Profile[]> {
    try {
      return await this.prisma.profile.findMany({
        include: {
          follower: {},
          projects: {},
        },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async getOne(uuId: string): Promise<Profile> {
    return this.prisma.profile.findFirstOrThrow({
      where: {
        uuid: uuId,
      },
      include: {
        education: {
          select: {
            uuid: true,
            title: true,
            from: true,
          },
        },
      },
    });
  }

  async getOneByUser(userId: string): Promise<Profile> {
    return this.prisma.profile.findFirstOrThrow({
      where: {
        userId,
      },
      include: {
        education: {
          select: {
            uuid: true,
            title: true,
            from: true,
          },
        },
        user: {
          select: {
            username: true,
            name: true,
          },
        },
        projects: {},
        follower: {},
      },
    });
  }

  async updateProfile(
    id: string,
    updateData: UpdateProfileRequest,
    username: string,
  ): Promise<Profile> {
    const { bio, image, title, education } = updateData;
    const { userId } = await this.getOne(id);
    if (userId !== username) {
      throw new ForbiddenException();
    }
    if (!userId) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    if (education) {
      await this.educationService.bulkUpdateEducation(education, username);
      return this.prisma.profile.update({
        where: {
          uuid: id,
        },
        data: {
          bio,
          title,
          image,
        },
        include: {
          education: true,
        },
      });
    }
    return this.prisma.profile.update({
      where: {
        uuid: id,
      },
      data: {
        bio,
        title,
        image,
      },
    });
  }
}
