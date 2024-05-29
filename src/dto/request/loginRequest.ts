import { IsNotEmpty } from 'class-validator';

export class LoginRequest {
  @IsNotEmpty({ message: 'Username field is required' })
  username: string;
  @IsNotEmpty({ message: 'Password field is required' })
  password: string;
}
