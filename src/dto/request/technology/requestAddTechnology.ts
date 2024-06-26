import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RequestAddTechnology {
  @IsNotEmpty({ message: 'Name field is required' })
  @MinLength(1, { message: 'Name must be at least 1 characters long' })
  @MaxLength(10, { message: 'Name must be at most 10 characters long' })
  name: string;
  image: string | null;
  @IsNotEmpty({ message: 'ProjectId field is required' })
  projectId: string;
}
