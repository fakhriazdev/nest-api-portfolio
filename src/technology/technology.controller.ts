import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { TechnologyService } from './technology.service';
import { AuthGuard } from '../security/authGuard';
import { Response } from 'express';
import { Technology } from '@prisma/client';
import { CommonResponse } from '../dto/response/commonResponse';
import { handleException } from '../utils/handleException';
import { RequestAddTechnology } from '../dto/request/technology/requestAddTechnology';
import { RequestUpdateTechnology } from '../dto/request/technology/requestUpdateTechnology';
import { RequestDeleteTechnology } from '../dto/request/technology/requestDeleteTechnology';

@Controller('/api/technology')
export class TechnologyController {
  constructor(private readonly technologyService: TechnologyService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getTechnologies(@Res() res: Response) {
    try {
      const responseTechnologies: Technology[] =
        await this.technologyService.getAllTechnologies();
      return  new CommonResponse(
        'Get Projects Successfully',
        HttpStatus.OK,
        responseTechnologies,
      );
    } catch (error) {
      handleException(error);
    }
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  async getTechnology(@Param('uuid') uuid: string, @Res() res: Response) {
    try {
      const responseTechnology: Technology =
        await this.technologyService.getTechnology(uuid);
return new CommonResponse(
        'Get Projects Successfully',
        HttpStatus.OK,
        responseTechnology,
      );
    } catch (error) {
      handleException(error);
    }
  }

  @Post()
  @UseGuards(AuthGuard)
  async addTechnology(
    @Request() req: any,
    @Body(new ValidationPipe({ transform: true }))
    request: RequestAddTechnology,
    @Res() res: Response,
  ) {
    const { username } = req.user;
    try {
      const responseAddTechnology: Technology =
        await this.technologyService.addTechnology(request, username);
      return new CommonResponse(
        'Add Technology Successfully',
        HttpStatus.CREATED,
        responseAddTechnology,
      );
    } catch (error) {
      handleException(error);
    }
  }

  @Patch('/update')
  @UseGuards(AuthGuard)
  async updateTechnologyById(
    @Request() req: any,
    @Body(new ValidationPipe({ transform: true }))
    request: RequestUpdateTechnology,
    @Res() res: Response,
  ) {
    const { username } = req.user;
    try {
      const responseUpdateTechnologyById: Technology =
        await this.technologyService.updateTechnologyById(request, username);
    return new CommonResponse<Technology>(
          'Update Technology Successfully',
          HttpStatus.OK,
          responseUpdateTechnologyById,
        );
    } catch (error) {
      handleException(error);
    }
  }

  @Delete('/delete')
  @UseGuards(AuthGuard)
  async deleteTechnologyById(
    @Request() req: any,
    @Body(new ValidationPipe({ transform: true }))
    request: RequestDeleteTechnology,
    @Res() res: Response,
  ) {
    const { username } = req.user;
    try {
      const responseDeleteTechnologyById: void =
        await this.technologyService.deleteTechnology(request, username);
     return new CommonResponse(
        'deleted Technology Successfully',
        HttpStatus.OK,
        responseDeleteTechnologyById,
      );
    } catch (error) {
      handleException(error);
    }
  }
}
