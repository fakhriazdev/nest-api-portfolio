import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdateEducationRequest {
  @IsNotEmpty({ message: 'UUID field is required' })
  uuid: string;
  @IsNotEmpty({ message: 'Title field is required' })
  @MinLength(4, { message: 'Title must be at least 5 characters long' })
  @MaxLength(10, { message: 'Title must be at most 10 characters long' })
  title: string;
  @IsNotEmpty({ message: 'From field is required' })
  @MinLength(4, { message: 'Form must be at least 5 characters long' })
  @MaxLength(10, { message: 'Form must be at most 10 characters long' })
  from: string;
}
