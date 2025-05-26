import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { CurrentUser } from '../strategy/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller({ path: 'tasks', version: '1' })
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateTaskDto) {
    return this.taskService.create(user.id, dto);
  }

  @Get('list/:listId')
  findAll(@Param('listId') listId: string) {
    return this.taskService.findAllByList(listId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.taskService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(id);
  }
}
