import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ListService } from '../services/list.service';
import { CreateListDto } from '../dto/create-list.dto';
import { UpdateListDto } from '../dto/update-list.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { CurrentUser } from 'src/strategy/decorators/current-user.decorator';
import { ApiOperation, ApiResponse, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser } from 'src/types/user.interface';

@ApiCookieAuth()
@ApiTags('Listas')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'lists', version: '1' })
export class ListController {
  constructor(private readonly listService: ListService) {}

  @ApiOperation({
    summary: 'Cria uma nova lista',
    description: 'Cria uma nova lista para o usuário autenticado',
  })
  @ApiResponse({ status: 201, description: 'Lista criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao criar a lista' })
  @ApiResponse({ status: 401, description: 'Usuário não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateListDto) {
    return this.listService.create(user.id, dto);
  }

  @ApiOperation({
    summary: 'Busca todas as listas de um quadro',
    description:
      'Busca todas as listas de um quadro específico do usuário autenticado',
  })
  @ApiResponse({ status: 200, description: 'Listas encontradas com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao buscar as listas' })
  @ApiResponse({ status: 401, description: 'Usuário não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @Get('board/:boardId')
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Param('boardId') boardId: string,
  ) {
    return this.listService.findAll(user.id, boardId);
  }

  @ApiOperation({
    summary: 'Busca uma lista específica',
    description: 'Busca uma lista específica pelo ID',
  })
  @ApiResponse({ status: 200, description: 'Lista encontrada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao buscar a lista' })
  @ApiResponse({ status: 401, description: 'Usuário não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listService.findOne(id);
  }

  @ApiOperation({
    summary: 'Atualiza uma lista',
    description: 'Atualiza uma lista específica pelo ID',
  })
  @ApiResponse({ status: 200, description: 'Lista atualizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao atualizar a lista' })
  @ApiResponse({ status: 401, description: 'Usuário não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateListDto) {
    return this.listService.update(id, dto);
  }

  @ApiOperation({
    summary: 'Atualiza a posição de uma lista',
    description: 'Atualiza a posição de uma lista específica pelo ID',
  })
  @ApiResponse({ status: 200, description: 'Lista atualizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao atualizar a lista' })
  @ApiResponse({ status: 401, description: 'Usuário não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @Patch(':id/position')
  updatePosition(
    @Param('id') id: string,
    @Body() dto: { newPosition: number },
  ) {
    return this.listService.updatePosition(id, dto.newPosition);
  }

  @ApiOperation({
    summary: 'Remove uma lista',
    description: 'Remove uma lista específica pelo ID',
  })
  @ApiResponse({ status: 200, description: 'Lista removida com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao remover a lista' })
  @ApiResponse({ status: 401, description: 'Usuário não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listService.remove(id);
  }
}
