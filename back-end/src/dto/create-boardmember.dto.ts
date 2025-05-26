import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateBoardMemberDto {
    @ApiProperty({})
    @IsNotEmpty()
    @IsNumber()
    boardId: number;

    @ApiProperty({})
    @IsNotEmpty()
    @IsNumber()
    userId: number;
}