import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        ...dto,
        creatorId: userId,
      },
    });
  }

  findAllByList(listId: string) {
    return this.prisma.task.findMany({
      where: { listId },
      orderBy: { position: 'asc' },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, dto: UpdateTaskDto) {
    await this.findOne(id); // garantir que existe
    return this.prisma.task.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.task.delete({ where: { id } });
  }
}
