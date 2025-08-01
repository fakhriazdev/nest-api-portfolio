import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  forwardRef,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Response, Request } from 'express';
import { AuthGuard } from '../security/authGuard';
import { CommonResponse } from '../dto/response/commonResponse';
import { Profile } from '@prisma/client';
import { UpdateProfileRequest } from '../dto/request/auth/updateProfileRequest';
import { handleException } from '../utils/handleException';

@Controller('/api/profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('/')
  @UseGuards(AuthGuard)
  async getProfiles(@Res() res: Response) {
    try {
      const getProfilesResponse: Profile[] = await this.profileService.getAll();
      return new CommonResponse('get profiles Successfully',
        HttpStatus.ACCEPTED,
        getProfilesResponse,)
    } catch (error) {
      if (error instanceof ConflictException) {
        return new CommonResponse( error.message,
          HttpStatus.CONFLICT,
          null,)
      } else if (error instanceof NotFoundException) {
        return new CommonResponse( error.message,
          HttpStatus.NOT_FOUND,
          null,)
      } else {
        return new CommonResponse(  'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,)
      }
    }
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  async getProfile(@Param('id') uuid: string, @Res() res: Response) {
    try {
      const getProfileResponse: Profile =
        await this.profileService.getOne(uuid);
      return new CommonResponse( 'get profile Successfully',
        HttpStatus.ACCEPTED,
        getProfileResponse,)
    } catch (error) {
      handleException(error);
    }
  }

  @Get('/user/:id')
  @UseGuards(AuthGuard)
  async getProfileByUser(@Param('id') id: string, @Res() res: Response) {
    try {
      const getProfileResponse: Profile =
        await this.profileService.getOneByUser(id);
      return new CommonResponse(
        'get profile Successfully',
        HttpStatus.ACCEPTED,
        getProfileResponse,
      );
    } catch (error) {
      handleException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Patch('/:id/update')
  async updateProfile(
    @Param('id') id: string,
    @Body() updateData: UpdateProfileRequest,
    @Req() req: any,
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
    return new CommonResponse(
      'Update Profile Successfully',
      HttpStatus.ACCEPTED,
      profileUpdateResponse,
    );

  }
}
