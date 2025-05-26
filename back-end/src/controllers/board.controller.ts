import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Board } from "@prisma/client";
import { BoardDto } from "src/dto/board.dto";
import { JwtAuthGuard } from "src/guards/jwt.guard";
import { BoardService } from "src/services/board.service";

@ApiTags('Boards')
@Controller({ path: 'board', version: '1'}) 
export class BoardController {
    constructor(private readonly boardService: BoardService){}

    @ApiOperation({
        summary: 'Ver board criado',
        description: 'Retornar informação de um board'
    })
    @ApiResponse({ status:200,description: 'Sucesso ao retornar o board' })
    @ApiResponse({ status: 404, description: 'Não foi possível encontrar board' })
    @UseGuards(JwtAuthGuard)
    @Get()
    async getBoard(@Request() req){
        const board = await this.boardService.getBoard(req.board.id);
        return board;
    }

    @ApiOperation({
        summary: 'Criar board',
        description: 'Mostrar que o board foi criado'
    })
    @ApiResponse({ status:200,description: 'Sucesso ao criar board' })
    @ApiResponse({ status: 404, description: 'Não foi possível criar' })
    @UseGuards(JwtAuthGuard)
    @Post()
    async createBoard(@Body() dto: BoardDto, @Request() req) {
        const userId = req.user.id;
        const boards = await this.boardService.createBoard({
            title: dto.title,
            description: dto.description,
            visibility: dto.visibility,
            user: {
                connect: { id: userId }
            },
            is_archived: false,
            created_at: "",
            updated_at: ""
        });

        return {
            message: "Board criado com sucessor",
            data: boards
        }
    }

    @ApiOperation({
        summary: 'Deletar board',
        description: 'Deletar o board que foi requerido'
    })
    @ApiResponse({ status:200,description: 'Sucesso ao deletar board' })
    @ApiResponse({ status: 404, description: 'Não foi possível deletar' })
    @UseGuards(JwtAuthGuard)
    @Delete()
    async deleteBoard(@Request() req){
        await this.boardService.deleteBoard(req.board.id);
        return {message: 'Board deletado com sucesso'};
    }

    @ApiOperation({
        summary: 'Atualizar o board',
        description: 'Mostrar que o board foi atualizado com sucesso'
    })
    @ApiResponse({ status:200,description: 'Sucesso ao atualizar board' })
    @ApiResponse({ status: 404, description: 'Não foi possível atualizar o board' })
    @UseGuards(JwtAuthGuard)
    @Put()
    async updateBoard(@Request() req, @Body() data: BoardDto){
        await this.boardService.updateBoard(req.board.id, data);
        return { message: 'Board atualizado com sucesso', data: data}
    }
}