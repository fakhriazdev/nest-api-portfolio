import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterRequest {
  @IsNotEmpty({ message: 'Username field is required' })
  @MinLength(6, { message: 'Username must be at least 6 characters long' })
  @MaxLength(10, { message: 'Username must be at most 10 characters long' })
  username: string;

  @IsNotEmpty({ message: 'Name field is required' })
  @MinLength(4, { message: 'Name must be at least 4 characters long' })
  @MaxLength(20, { message: 'Name must be at most 20 characters long' })
  name: string;
  @IsNotEmpty({ message: 'Password field is required' })
  @MinLength(4, { message: 'Password must be at least 4 characters long' })
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/, {
    message:
      'Password must contain at least one capital letter and one special character',
  })
  password: string;
}
