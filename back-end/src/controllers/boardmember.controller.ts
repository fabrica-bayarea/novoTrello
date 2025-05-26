import { Body, Controller, Post, UseGuards, Param, Get, Delete } from "@nestjs/common";
import { CreateBoardMemberDto } from "src/dto/create-boardmember.dto";
import { BoardMemberService } from "src/services/boardmember.service";
import { Req } from "@nestjs/common";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { Request } from "express";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";


@Controller('teste-member')
@UseGuards(JwtAuthGuard)
export class BoardMemberController {
    constructor(private readonly boardMemberService: BoardMemberService) {}

    @ApiOperation({
        summary: 'Usuários no Board',
        description: 'Retorna as informações dos usuários ligados ao board',
    })
    @ApiResponse({ status: 200, description: 'Sucesso ao mostrar usuários' })
    @ApiResponse({ status: 404, description: 'Board não encontrado' })
    @UseGuards(JwtAuthGuard)
    @Get('boardId')
    async getMemberList(@Request() req) {
        const boardMembers = await this.boardMemberService.listMembers(req.user.id)
        return boardMembers;
    }

    @Post('create')
    async addMember(@Req() req: Request, @Body() dto: CreateBoardMemberDto) {
        const currentUserId = (req.user as { id: number }).id; 
        return this.boardMemberService.addMember(currentUserId, dto)
    }

    @Delete('removeMember')
    async removeMember(@Req() req: Request, @Param('boardId') boardId: number, @Param('userId') userId: number) {
        const currentUserId = (req.user as { id: number }).id;
        return this.boardMemberService.removeMember(currentUserId, boardId, userId);
    }
}