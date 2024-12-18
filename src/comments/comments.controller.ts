import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { FastifyReply as Response } from 'fastify';
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
      const comments: Comment[] =
        await this.commentService.getComments(projectId);
      const commonResponse: CommonResponse<Comment[]> = new CommonResponse(
        'get Comments Successfully',
        HttpStatus.OK,
        comments,
      );
      res.code(commonResponse.statusCode).send(commonResponse);
    } catch (error) {
      handleException(error, res);
    }
  }

  @Post()
  async addComment(
    @Body(new ValidationPipe({ transform: true }))
    requests: AddCommentRequest,
    @Request() request: any,
    @Res() res: Response,
  ) {
    const { username } = request.user;
    try {
      const comments: String = await this.commentService.addComment(
        requests,
        username,
      );
      const commonResponse: CommonResponse<String> = new CommonResponse(
        'get Comment Successfully',
        HttpStatus.OK,
        comments,
      );
      res.code(commonResponse.statusCode).send(commonResponse);
    } catch (error) {
      handleException(error, res);
    }
  }
}
