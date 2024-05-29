import { Response } from 'express';
import {
  ConflictException,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import { CommonResponse } from '../dto/response/commonResponse';

export const handleException = (error: any, res: Response) => {
  let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Internal server error';

  if (error instanceof ConflictException) {
    statusCode = HttpStatus.CONFLICT;
    message = error.message;
  } else if (error instanceof ForbiddenException) {
    statusCode = HttpStatus.FORBIDDEN;
    message = error.message;
  }

  const commonResponse = new CommonResponse(message, statusCode, null);
  res.status(commonResponse.statusCode).json(commonResponse);
};
