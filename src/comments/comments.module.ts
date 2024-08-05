import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { PrismaService } from '../db/prisma.service';
import { CommentsService } from './comments.service';

@Module({
  providers: [CommentsService,PrismaService],
  exports:[CommentsService]
})
export class CommentsModule {}
