import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export enum BoardVisibility {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
}

export class BoardDto {
    @ApiProperty({})
    @IsNotEmpty({})
    @IsString({})
    ownerId: string;

    @ApiProperty({})
    @IsNotEmpty({})
    @IsString({})
    @Matches(/^[a-zA-Z0-9 ]{1,20}$/, {
        message: 'O título deve conter letras, números e espaços.'
    })
    title: string;

    @ApiProperty({})
    @IsOptional({})
    @IsString({})
    description?: string;

    @IsEnum(BoardVisibility)
    visibility: BoardVisibility = BoardVisibility.PRIVATE

    @ApiProperty({})
    @IsNotEmpty({})
    @IsBoolean({})
    isArchived: boolean = false;
}