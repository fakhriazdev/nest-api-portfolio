import { Body, Controller, Get, HttpStatus, Post, Request, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Response } from 'express';
import { CommonResponse } from '../dto/response/commonResponse';
import { handleException } from '../utils/handleException';
import { AddCommentRequest } from '../dto/request/comment/addCommentRequest';
import { Comment } from '@prisma/client';
import { AuthGuard } from 'src/security/authGuard';

@Controller('/api/comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @UseGuards(AuthGuard)
  @Get()
    async getComment(request:string,@Res() res: Response){
    try {
      const comments :Comment[] = await this.commentService.getComment(request);
      const commonResponse: CommonResponse<Comment[]> = new CommonResponse(
        'get Comment Successfully',
        HttpStatus.OK,
        comments,
      );
      res.status(commonResponse.statusCode).json(commonResponse);
    } catch (error) {
      handleException(error, res);
    }
  }

  @Post()
  async addComment(
    @Body(new ValidationPipe({ transform: true }))
      requests: AddCommentRequest,
    @Request() request: any,
      @Res() res: Response){
    const { username } = request.user;
    try {
      const comments:String = await this.commentService.addComment(requests,username);
      const commonResponse: CommonResponse<String> = new CommonResponse(
        'get Comment Successfully',
        HttpStatus.OK,
        comments,
      );
      res.status(commonResponse.statusCode).json(commonResponse);
    } catch (error) {
      handleException(error, res);
    }
  }
}
