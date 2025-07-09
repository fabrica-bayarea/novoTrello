import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from 'src/services/task.service';
import { PrismaService } from 'src/services/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from 'src/dto/create-task.dto';
import { UpdateTaskDto } from 'src/dto/update-task.dto';
import { TaskStatus } from 'src/common/enums/task-status.enum';

describe('TaskService', () => {
  let service: TaskService;

  const mockPrisma = {
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a task with correct data', async () => {
      const userId = 'user-123';
      const dto: CreateTaskDto = {
        title: 'Tarefa Teste',
        listId: 'list-1',
        position: 1,
        status: TaskStatus.TODO,
      };
      const createdTask = { id: 'task-1', ...dto, creatorId: userId };

      mockPrisma.task.create.mockResolvedValue(createdTask);

      const result = await service.create(userId, dto);

      expect(mockPrisma.task.create).toHaveBeenCalledWith({
        data: { ...dto, creatorId: userId },
      });
      expect(result).toEqual(createdTask);
    });
  });

  describe('findAllByList', () => {
    it('should return all tasks for a list ordered by position', async () => {
      const listId = 'list-1';
      const tasks = [
        { id: 'task-1', position: 1 },
        { id: 'task-2', position: 2 },
      ];

      mockPrisma.task.findMany.mockResolvedValue(tasks);

      const result = await service.findAllByList(listId);

      expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
        where: { listId },
        orderBy: { position: 'asc' },
      });
      expect(result).toEqual(tasks);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const id = 'task-1';
      const task = { id, title: 'Teste' };

      mockPrisma.task.findUnique.mockResolvedValue(task);

      const result = await service.findOne(id);

      expect(mockPrisma.task.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(task);
    });

    it('should throw NotFoundException if task not found', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(null);

      await expect(service.findOne('not-found')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a task if it exists', async () => {
      const id = 'task-1';
      const dto: UpdateTaskDto = { title: 'Atualizada' };
      const existingTask = { id, title: 'Original' };
      const updatedTask = { id, title: 'Atualizada' };

      mockPrisma.task.findUnique.mockResolvedValue(existingTask);
      mockPrisma.task.update.mockResolvedValue(updatedTask);

      const result = await service.update(id, dto);

      expect(mockPrisma.task.update).toHaveBeenCalledWith({
        where: { id },
        data: dto,
      });
      expect(result).toEqual(updatedTask);
    });
  });

  describe('remove', () => {
    it('should delete a task if it exists', async () => {
      const id = 'task-1';
      const existingTask = { id, title: 'Para deletar' };

      mockPrisma.task.findUnique.mockResolvedValue(existingTask);
      mockPrisma.task.delete.mockResolvedValue({ id });

      const result = await service.remove(id);

      expect(mockPrisma.task.delete).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual({ id });
    });
  });
});
