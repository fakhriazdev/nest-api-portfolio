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
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { FastifyReply as Response } from 'fastify';
import { AuthGuard } from '../security/authGuard';
import { CommonResponse } from '../dto/response/commonResponse';
import { Profile } from '.prisma/client';
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
      const commonResponse = new CommonResponse(
        'get profiles Successfully',
        HttpStatus.ACCEPTED,
        getProfilesResponse,
      );
      res.code(commonResponse.statusCode).send(commonResponse);
    } catch (error) {
      if (error instanceof ConflictException) {
        const commonResponse = new CommonResponse(
          error.message,
          HttpStatus.CONFLICT,
          null,
        );
        res.code(commonResponse.statusCode).send(commonResponse);
      } else if (error instanceof NotFoundException) {
        const commonResponse = new CommonResponse(
          error.message,
          HttpStatus.NOT_FOUND,
          null,
        );
        res.code(commonResponse.statusCode).send(commonResponse);
      } else {
        const commonResponse = new CommonResponse(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
        );
        res.code(commonResponse.statusCode).send(commonResponse);
      }
    }
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  async getProfile(@Param('id') uuid: string, @Res() res: Response) {
    try {
      const getProfileResponse: Profile =
        await this.profileService.getOne(uuid);
      const commonResponse = new CommonResponse(
        'get profile Successfully',
        HttpStatus.ACCEPTED,
        getProfileResponse,
      );
      res.code(commonResponse.statusCode).send(commonResponse);
    } catch (error) {
      handleException(error, res);
    }
  }

  @Get('/user/:id')
  @UseGuards(AuthGuard)
  async getProfileByUser(@Param('id') id: string, @Res() res: Response) {
    try {
      const getProfileResponse: Profile =
        await this.profileService.getOneByUser(id);
      const commonResponse = new CommonResponse(
        'get profile Successfully',
        HttpStatus.ACCEPTED,
        getProfileResponse,
      );
      res.code(commonResponse.statusCode).send(commonResponse);
    } catch (error) {
      handleException(error, res);
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
    res.code(commonResponse.statusCode).send(commonResponse);
  }
}
