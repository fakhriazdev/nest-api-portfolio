import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TechnologyService } from './technology.service';
import { AuthGuard } from '../security/authGuard';
import { Response } from 'express';
import { Technology } from '@prisma/client';
import { CommonResponse } from '../dto/response/commonResponse';
import { handleException } from '../utils/handleException';

@Controller('/api/technology')
export class TechnologyController {
  constructor(private readonly technologyService: TechnologyService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getTechnologies(@Res() res: Response) {
    try {
      const responseTechnologies: Technology[] =
        await this.technologyService.getAllTechnologies();
      const commonResponse: CommonResponse<Technology[]> = new CommonResponse(
        'Get Projects Successfully',
        HttpStatus.OK,
        responseTechnologies,
      );
      res.status(commonResponse.statusCode).json(commonResponse);
    } catch (error) {
      handleException(error, res);
    }
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  async getTechnology(@Param('uuid') uuid: string, @Res() res: Response) {
    try {
      const responseTechnology: Technology =
        await this.technologyService.getTechnology(uuid);
      const commonResponse: CommonResponse<Technology> = new CommonResponse(
        'Get Projects Successfully',
        HttpStatus.OK,
        responseTechnology,
      );
      res.status(commonResponse.statusCode).json(commonResponse);
    } catch (error) {
      handleException(error, res);
    }
  }
}
