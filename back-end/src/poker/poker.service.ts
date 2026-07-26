import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreatePokerSessionDto } from './dto/create-poker-session.dto';

/** Formato devolvido ao front (lib/actions/poker.ts espera taskIds achatado). */
export interface PokerSessionResponse {
  id: string;
  boardId: string;
  taskIds: string[];
  createdAt: Date;
}

@Injectable()
export class PokerService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Garante que o usuário participa do board (dono ou membro).
   * Poker Planning é atividade de equipe: qualquer membro pode abrir e ver
   * uma sessão — diferente de sprint, que exige admin.
   */
  private async assertBoardMember(boardId: string, userId: string) {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
      include: { members: { where: { userId } } },
    });
    if (!board) throw new NotFoundException('Board não encontrado');
    const isOwner = board.ownerId === userId;
    const isMember = board.members.length > 0;
    if (!isOwner && !isMember) {
      throw new ForbiddenException('Você não tem acesso a este board');
    }
    return board;
  }

  async create(
    boardId: string,
    userId: string,
    dto: CreatePokerSessionDto,
  ): Promise<PokerSessionResponse> {
    await this.assertBoardMember(boardId, userId);

    // Só aceita tasks que pertencem a ESTE board (via list) e não foram
    // apagadas — evita montar sessão com task de outro board.
    const tasks = await this.prisma.task.findMany({
      where: {
        id: { in: dto.taskIds },
        deletedAt: null,
        list: { boardId },
      },
      select: { id: true },
    });

    if (tasks.length !== dto.taskIds.length) {
      throw new BadRequestException(
        'Uma ou mais tasks não pertencem a este board ou não existem',
      );
    }

    const session = await this.prisma.pokerSession.create({
      data: {
        boardId,
        createdById: userId,
        tasks: { create: tasks.map((t) => ({ taskId: t.id })) },
      },
      include: { tasks: { select: { taskId: true } } },
    });

    return {
      id: session.id,
      boardId: session.boardId,
      taskIds: session.tasks.map((t) => t.taskId),
      createdAt: session.createdAt,
    };
  }

  async findOne(
    boardId: string,
    sessionId: string,
    userId: string,
  ): Promise<PokerSessionResponse> {
    await this.assertBoardMember(boardId, userId);

    const session = await this.prisma.pokerSession.findUnique({
      where: { id: sessionId },
      include: { tasks: { select: { taskId: true } } },
    });

    // Checa o board da sessão: impede ler sessão de outro board passando um
    // boardId ao qual o usuário tem acesso.
    if (!session || session.boardId !== boardId) {
      throw new NotFoundException('Sessão de Poker Planning não encontrada');
    }

    return {
      id: session.id,
      boardId: session.boardId,
      taskIds: session.tasks.map((t) => t.taskId),
      createdAt: session.createdAt,
    };
  }
}
