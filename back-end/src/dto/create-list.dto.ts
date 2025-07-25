import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateListDto {
  @ApiProperty({
    example: 'boardId123',
    description: 'ID do quadro ao qual a lista pertence',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  boardId: string;

  @ApiProperty({
    example: 'To Do',
    description: 'Título da lista',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 1,
    description: 'Posição da lista dentro do quadro',
    required: true,
  })
  @IsInt()
  position: number;
}
