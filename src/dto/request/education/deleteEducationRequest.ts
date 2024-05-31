import { IsNotEmpty } from 'class-validator';

export class DeleteEducationRequest {
  @IsNotEmpty({ message: 'UUID field is required' })
  uuid: string;
}
