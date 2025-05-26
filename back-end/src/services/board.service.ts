import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { Board, Prisma } from "@prisma/client";
import { BoardDto } from "src/dto/board.dto";

@Injectable()
export class BoardService {
    constructor(private readonly prisma: PrismaService){}

    async getBoard(id: number) {
        const board = await this.prisma.board.findUnique({
            where: {id:Number(id)}
        })

        if (!board) {
            throw new Error("Board não encontrado")
        }

        return board;
    }

    async createBoard(data: Prisma.BoardCreateInput){
        const createdBoard = await this.prisma.board.create({
            data,
        })

        if (!createdBoard) {
            throw new Error("Não foi possível criar o board")
        }

        return createdBoard
    }

    async updateBoard(id: number, data: BoardDto){
        const updatedBoard = await this.prisma.board.update({
            where:{id:Number(id)},
            data:{title: data.title,
                description: data.description,
                visibility: data.visibility}
        })

        if (!updatedBoard) {
            throw new Error("Não foi possível atualizar")
        }

        return updatedBoard;
    }

    async deleteBoard(id: number){
        const deletedBoard = await this.prisma.board.delete({
            where: {id:Number(id)}
        })

        if (!deletedBoard) {
            throw new Error("Erro ao tentar deletar o board")
        }

        return deletedBoard;
    }
}