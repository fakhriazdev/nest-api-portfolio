import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class AddCommentRequest {
  @IsNotEmpty({ message: 'comment field is required' })
  comment: string;
  @IsNotEmpty({ message: 'projectId field is required' })
  projectId: string;
}
