import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateListDto {
  @IsString()
  @IsNotEmpty()
  boardId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  position: number;
}
