import { IsString, IsOptional, IsInt, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  listId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  position: number;

  @IsString()
  status: string;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;
}
