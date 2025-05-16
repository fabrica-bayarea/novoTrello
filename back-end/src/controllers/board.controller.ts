import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { Board } from "@prisma/client";
import { BoardService } from "src/services/board.service";


@Controller('board/v1') 
export class BoardController {
    constructor(private readonly boardService: BoardService){}

    @Get()
    async getAllBoard(): Promise <Board[]>{
        return this.boardService.getAllBoard()
    }

    @Get(':id')
    async getBoard(@Param('id') id: number): Promise <Board | null>{
        return this.boardService.getBoard(id)
    }

    @Post('createboard')
    async createBoard(@Body() postData: Board): Promise <Board>{
        return this.boardService.createBoard(postData)
    }

    @Delete('id')
    async deleteBoard(@Param('id') id:number): Promise <Board>{
        return this.boardService.deleteBoard(id)
    }

    @Put('id')
    async updateBoard(@Param('id') id:number, @Body() postData: Board): Promise <Board>{
        return this.boardService.updateBoard(id, postData)
    }
}