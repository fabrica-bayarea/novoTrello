import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateBoardMemberDto {
    @IsNotEmpty()
    @IsNumber()
    boardId: number;

    @IsNotEmpty()
    @IsNumber()
    userId: number;
}