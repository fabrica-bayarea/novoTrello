import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { endOfDay } from 'date-fns';

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
    await this.findOne(id);
    return this.prisma.task.update({
      where: { id },
      data: dto,
    });
  }

  async updatePosition(id: string, newPosition: number) {
    const task = await this.findOne(id);
    const oldPosition = task.position;

    if (newPosition < oldPosition) {
      await this.prisma.task.updateMany({
        where: {
          position: { gte: newPosition, lt: oldPosition },
        },
        data: {
          position: { increment: 1 },
        },
      });
    } else if (newPosition > oldPosition) {
      await this.prisma.task.updateMany({
        where: {
          position: { gt: oldPosition, lte: newPosition },
        },
        data: {
          position: { decrement: 1 },
        },
      });
    }

    await this.prisma.task.update({
      where: { id },
      data: { position: newPosition },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.task.delete({ where: { id } });
  }

  async findTasksOverdueDate(userId: string) {
    const today = new Date();

    return this.prisma.task.findMany({
      where: {
        creatorId: userId,
        dueDate: {
          lte: endOfDay(today),
        },
      },
      include: {
        list: {
          include: {
            board: true,
          },
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }
}
