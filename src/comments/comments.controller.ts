import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post, Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Response, Request } from 'express';
import { CommonResponse } from '../dto/response/commonResponse';
import { handleException } from '../utils/handleException';
import { AddCommentRequest } from '../dto/request/comment/addCommentRequest';
import { Comment } from '@prisma/client';
import { AuthGuard } from '../security/authGuard';

@Controller('/api/comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @UseGuards(AuthGuard)
  @Get('/:projectId')
  async getComments(
    @Param('projectId') projectId: string,
    @Res() res: Response,
  ) {
    try {
      const comments: Comment[] = await this.commentService.getComments(projectId);
      return new CommonResponse( 'get Comments Successfully', HttpStatus.OK,comments);
    } catch (error) {
      handleException(error);
    }
  }

  @Post()
  async addComment(
    @Body(new ValidationPipe({ transform: true }))
    requests: AddCommentRequest,
    @Req() request: any,
    @Res() res: Response,
  ) {
    const { username } = request.user;
    try {
      const comment: String = await this.commentService.addComment(
        requests,
        username,
      );
      const commonResponse: CommonResponse<String> = new CommonResponse(
        'get Comment Successfully',
        HttpStatus.OK,
        comment,
      );
      return new CommonResponse('get Comment Successfully', HttpStatus.OK,comment,);
    } catch (error) {
      handleException(error);
    }
  }
}
