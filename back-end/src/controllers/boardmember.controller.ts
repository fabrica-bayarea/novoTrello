import { Body, Controller, Post, UseGuards, Param, Get, Delete } from "@nestjs/common";
import { CreateBoardMemberDto } from "src/dto/create-boardmember.dto";
import { BoardMemberService } from "src/services/boardmember.service";
import { Req } from "@nestjs/common";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { Request } from "express";


@Controller('teste-member')
@UseGuards(JwtAuthGuard)
export class BoardMemberController {
    constructor(private readonly boardMemberService: BoardMemberService) {}

    //listar membros que estão ligados ao board em questão, com ID como parâmetro 
    @Get('boardId')
    async listMembers(@Param('id') id: number) {
        return this.boardMemberService.listMembers(id)
    }

    @Post('create')
    async addMember(@Req() req: Request, @Body() dto: CreateBoardMemberDto) {
        const currentUserId = (req.user as { id: number }).id; //defini a tipagem aqui dentro do controller 
        //para deixar mais rápido por motivos de teste, irei mudar para um arquivo separado.
        return this.boardMemberService.addMember(currentUserId, dto)
    }

    @Delete('removeMember')
    async removeMember(@Req() req: Request, @Param('boardId') boardId: number, @Param('userId') userId: number) {
        const currentUserId = (req.user as { id: number }).id;
        return this.boardMemberService.removeMember(currentUserId, boardId, userId);
    }
}