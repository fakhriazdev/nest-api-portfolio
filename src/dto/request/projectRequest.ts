import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class ProjectRequest {
  @IsNotEmpty({ message: 'Title field is required' })
  @MinLength(4, { message: 'Title must be at least 4 characters long' })
  @MaxLength(20, { message: 'Title must be at most 20 characters long' })
  title: string;
  @IsNotEmpty({ message: 'Stack field is required' })
  stack: string;
}
