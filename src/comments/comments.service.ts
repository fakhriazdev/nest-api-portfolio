import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { Comment } from '@prisma/client';
import { AddCommentRequest } from '../dto/request/comment/addCommentRequest';
import { v4 } from 'uuid';


@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getComments(projectId: string): Promise<Comment[] | []> {
    const data = await this.prisma.comment.findMany({
      where: {
        projectId
      }
    });
    
    if (data){
      return data
    }
    return []
  }

  async addComment(request: AddCommentRequest,userId:string): Promise<String> {
    const {projectId,comment} = request
      try {
       await this.prisma.comment.create({
          data: {
            uuid: v4(),
            projectId,
            userId,
            comment: comment,
            createdAt: new Date(),
          },
        });

        return 'thanks for comment';
      } catch (error) {
        throw new Error('Unable to add comment');
      }
    }

}
