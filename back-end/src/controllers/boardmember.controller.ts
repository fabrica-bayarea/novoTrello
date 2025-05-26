import { Body, Controller, Post, UseGuards, Param, Get, Delete } from "@nestjs/common";
import { CreateBoardMemberDto } from "src/dto/create-boardmember.dto";
import { BoardMemberService } from "src/services/boardmember.service";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { Request } from "@nestjs/common"
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
    @Get()
    async getMemberList(@Request() req) {
        const boardMembers = await this.boardMemberService.listMembers(req.user.id)
        return boardMembers;
    }

    @Post()
    async addMember(@Request() req, @Body() dto: CreateBoardMemberDto) {
        const currentUserId = (req.user.id)
        return this.boardMemberService.addMember(currentUserId, dto)
    }

    @Delete()
    async removeMember(
        @Request() req, 
        @Param('boardId') boardId: number, 
        @Param('userId') userId: number) {
        const currentUserId = (req.user as { id: number }).id;
        return this.boardMemberService.removeMember(currentUserId, boardId, userId);
    }
}