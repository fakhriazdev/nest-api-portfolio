import { Profile } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { UpdateUserRequest } from 'src/dto/request/updateUserRequest';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<Profile[]> {
    try {
      const profiles = await this.prisma.profile.findMany();
      return profiles;
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

  async updateProfile(
    id: string,
    updateData: UpdateUserRequest,
  ): Promise<Profile> {
    const { bio, image, title } = updateData;
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
