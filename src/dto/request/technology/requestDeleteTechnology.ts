import { IsNotEmpty } from 'class-validator';

export class RequestDeleteTechnology {
  @IsNotEmpty({ message: 'Name field is required' })
  uuid: string;
  @IsNotEmpty({ message: 'ProjectId field is required' })
  projectId: string;
}
