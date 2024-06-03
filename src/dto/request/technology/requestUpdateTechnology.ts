import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RequestUpdateTechnology {
  @IsNotEmpty({ message: 'uuid field is required' })
  uuid: string;
  @IsNotEmpty({ message: 'Name field is required' })
  @MinLength(1, { message: 'Name must be at least 1 characters long' })
  @MaxLength(10, { message: 'Name must be at most 10 characters long' })
  name: string;
  @IsNotEmpty({ message: 'ProjectId field is required' })
  image: string | null;
  projectId: string;
}
