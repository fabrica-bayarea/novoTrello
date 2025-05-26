import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/strategy/decorators/current-user.decorator';
import { BoardService } from '../services/board.service';
import { CreateBoardDto } from '../dto/create-board.dto';
import { UpdateBoardDto } from '../dto/update-board.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller({ path: 'boards', version: '1' })
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @ApiOperation({
    summary: 'Cria um novo quadro',
    description: 'Cria um novo quadro para o usuário autenticado',
  })
  @ApiResponse({ status: 201, description: 'Quadro criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao criar o quadro' })
  @ApiResponse({ status: 401, description: 'Usuário não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateBoardDto) {
    return this.boardService.create(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.boardService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBoardDto) {
    return this.boardService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardService.remove(id);
  }
}
