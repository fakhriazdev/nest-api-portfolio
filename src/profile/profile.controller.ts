import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Response } from 'express';
import { AuthGuard } from 'src/security/authGuard';

import { CommonResponse } from 'src/dto/response/commonResponse';
import { Profile } from '.prisma/client';
import { UpdateProfileRequest } from 'src/dto/request/updateProfileRequest';

@Controller('/api/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('/')
  @UseGuards(AuthGuard)
  async getProfiles(@Res() res: Response) {
    try {
      const getProfilesResponse: Profile[] = await this.profileService.getAll();
      const commonResponse = new CommonResponse(
        'get profiles Successfully',
        HttpStatus.ACCEPTED,
        getProfilesResponse,
      );
      res.status(commonResponse.statusCode).json(commonResponse);
    } catch (error) {
      if (error instanceof ConflictException) {
        const commonResponse = new CommonResponse(
          error.message,
          HttpStatus.CONFLICT,
          null,
        );
        res.status(commonResponse.statusCode).json(commonResponse);
      } else if (error instanceof NotFoundException) {
        const commonResponse = new CommonResponse(
          error.message,
          HttpStatus.NOT_FOUND,
          null,
        );
        res.status(commonResponse.statusCode).json(commonResponse);
      } else {
        const commonResponse = new CommonResponse(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
        );
        res.status(commonResponse.statusCode).json(commonResponse);
      }
    }
  }

  // @UseGuards(AuthGuard)
  @Get('/:id')
  async getProfile(@Param('id') uuid: string, @Res() res: Response) {
    try {
      const getProfileResponse: Profile =
        await this.profileService.getOne(uuid);
      const commonResponse = new CommonResponse(
        'get profile Successfully',
        HttpStatus.ACCEPTED,
        getProfileResponse,
      );
      res.status(commonResponse.statusCode).json(commonResponse);
    } catch (error) {
      if (error instanceof ConflictException) {
        const commonResponse = new CommonResponse(
          error.message,
          HttpStatus.CONFLICT,
          null,
        );
        res.status(commonResponse.statusCode).json(commonResponse);
      } else if (error instanceof NotFoundException) {
        const commonResponse = new CommonResponse(
          error.message,
          HttpStatus.NOT_FOUND,
          null,
        );
        res.status(commonResponse.statusCode).json(commonResponse);
      } else {
        const commonResponse = new CommonResponse(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
        );
        res.status(commonResponse.statusCode).json(commonResponse);
      }
    }
  }

  @UseGuards(AuthGuard)
  @Patch('/:id/update')
  async updateProfile(
    @Param('id') id: string,
    @Body() updateData: UpdateProfileRequest,
    @Request() req: any,
    @Res() res: Response,
  ) {
    const { username } = req.user;
    const { userId } = await this.profileService.getOne(id);
    if (userId !== username) {
      throw new ForbiddenException();
    }
    if (!userId) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const profileUpdateResponse = await this.profileService.updateProfile(
      id,
      updateData,
      username,
    );
    const commonResponse = new CommonResponse(
      'Update Profile Successfully',
      HttpStatus.ACCEPTED,
      profileUpdateResponse,
    );
    res.status(commonResponse.statusCode).json(commonResponse);
  }
}
