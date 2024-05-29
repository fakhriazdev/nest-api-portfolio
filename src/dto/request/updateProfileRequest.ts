import { UpdateEducationRequest } from './UpdateEducationRequest';
import { MaxLength, MinLength } from 'class-validator';

export class UpdateProfileRequest {
  image: string | null;
  @MinLength(1, { message: 'Title must be at least 1 characters long' })
  @MaxLength(20, { message: 'Title must be at most 10 characters long' })
  title: string | null;
  @MaxLength(300, { message: 'Bio must be at most 300 characters long' })
  bio: string | null;
  education: UpdateEducationRequest[] | null;
}
