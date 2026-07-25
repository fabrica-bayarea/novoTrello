import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class CreatePokerSessionDto {
  @ApiProperty({
    example: ['1234567890abcdef12345678'],
    description: 'IDs das tasks que entram na sessão de estimativa',
    type: [String],
  })
  @IsArray({ message: 'taskIds deve ser uma lista' })
  @ArrayNotEmpty({ message: 'Selecione ao menos uma task' })
  @ArrayMaxSize(50, { message: 'No máximo 50 tasks por sessão' })
  @IsString({ each: true, message: 'Cada taskId deve ser uma string' })
  taskIds!: string[];
}
