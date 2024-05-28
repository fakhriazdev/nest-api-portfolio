import { User } from '@prisma/client';

export class UpdateUserRequest {
  image: string | null;
  title: string | null;
  bio: string | null;
  user: User;
}
