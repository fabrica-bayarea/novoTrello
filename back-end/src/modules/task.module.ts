import { Module } from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { TaskController } from '../controllers/task.controller';
import { PrismaService } from '../services/prisma.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, PrismaService],
})
export class TaskModule {}
