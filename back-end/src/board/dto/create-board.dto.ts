import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BoardVisibility } from 'src/common/enums/board-visibility.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBoardDto {
  @ApiProperty({
    example: 'Meu Primeiro Board',
    description: 'O título do board',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Isso é um board de exemplo',
    description: 'Uma descrição opcional do board',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'PRIVATE',
    description: 'Visibilidade do board',
    enum: BoardVisibility,
    required: false,
  })
  @IsOptional()
  @IsEnum(BoardVisibility)
  visibility?: BoardVisibility;
}
