import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class AddEducationRequest {
  @IsNotEmpty({ message: 'ProfileUuid field is required' })
  ProfileUuid: string;
  @IsNotEmpty({ message: 'Title field is required' })
  @MinLength(4, { message: 'Title must be at least 5 characters long' })
  @MaxLength(10, { message: 'Title must be at most 10 characters long' })
  title: string;

  @IsNotEmpty({ message: 'From field is required' })
  from: string;
}
