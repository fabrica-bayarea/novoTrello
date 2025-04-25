import { Module } from "@nestjs/common";
import { BoardController } from "src/controllers/board.controller";
import { BoardService } from "src/services/board.service";
import { PrismaService } from "src/services/prisma.service";


@Module({
    controllers: [BoardController],
    providers: [BoardService, PrismaService]
})
export class BoardModule{}