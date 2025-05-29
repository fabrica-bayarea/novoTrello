import { Module } from '@nestjs/common';
import { BoardService } from '../services/board.service';
import { BoardController } from '../controllers/board.controller';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  controllers: [BoardController],
  providers: [BoardService, PrismaService],
})
export class BoardModule {}
