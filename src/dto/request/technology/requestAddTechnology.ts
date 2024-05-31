import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class AddtechnologyRequest {
  @IsNotEmpty({ message: 'Title field is required' })
  @MinLength(1, { message: 'Title must be at least 1 characters long' })
  @MaxLength(10, { message: 'Title must be at most 10 characters long' })
  name: string;
  image: string | null;
}
