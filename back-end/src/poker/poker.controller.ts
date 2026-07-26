import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { CurrentUser } from '@/auth/strategy/decorators/current-user.decorator';
import { AuthenticatedUser } from '@/types/user.interface';

import { CreatePokerSessionDto } from './dto/create-poker-session.dto';
import { PokerService } from './poker.service';

@ApiCookieAuth()
@ApiTags('Poker Planning')
@UseGuards(JwtAuthGuard)
@Controller({ version: '1' })
export class PokerController {
  constructor(private readonly pokerService: PokerService) {}

  @ApiOperation({ summary: 'Cria uma sessão de Poker Planning no board' })
  @ApiResponse({ status: 201, description: 'Sessão criada' })
  @ApiResponse({ status: 400, description: 'Task inválida para este board' })
  @ApiResponse({ status: 403, description: 'Sem acesso ao board' })
  @Post('boards/:boardId/poker-sessions')
  create(
    @Param('boardId') boardId: string,
    @Body() dto: CreatePokerSessionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.pokerService.create(boardId, user.id, dto);
  }

  @ApiOperation({ summary: 'Retorna uma sessão de Poker Planning' })
  @ApiResponse({ status: 200, description: 'Sessão encontrada' })
  @ApiResponse({ status: 404, description: 'Sessão não encontrada' })
  @Get('boards/:boardId/poker-sessions/:sessionId')
  findOne(
    @Param('boardId') boardId: string,
    @Param('sessionId') sessionId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.pokerService.findOne(boardId, sessionId, user.id);
  }
}
