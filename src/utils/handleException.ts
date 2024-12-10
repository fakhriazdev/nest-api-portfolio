import { FastifyReply } from 'fastify'; // Import FastifyReply
import {
  ConflictException,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import { CommonResponse } from '../dto/response/commonResponse';

export const handleException = (error: any, res: FastifyReply) => {
  let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = error.message;

  // Menangani jenis exception yang berbeda
  if (error instanceof ConflictException) {
    statusCode = HttpStatus.CONFLICT;
    message = error.message;
  } else if (error instanceof ForbiddenException) {
    statusCode = HttpStatus.FORBIDDEN;
    message = error.message;
  }

  // Membuat response menggunakan CommonResponse
  const commonResponse = new CommonResponse(message, statusCode, null);

  // Mengirim response dengan FastifyReply menggunakan .code() dan .send()
  res.code(commonResponse.statusCode).send(commonResponse);
};
