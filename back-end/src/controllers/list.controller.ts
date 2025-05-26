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

@UseGuards(JwtAuthGuard)
@Controller({ path: 'lists', version: '1' })
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateListDto) {
    return this.listService.create(user.id, dto);
  }

  @Get('board/:boardId')
  findAll(@CurrentUser() user: any, @Param('boardId') boardId: string) {
    return this.listService.findAll(user.id, boardId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateListDto) {
    return this.listService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listService.remove(id);
  }
}
