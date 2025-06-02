import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from 'src/controllers/task.controller';
import { TaskService } from 'src/services/task.service';
import { CreateTaskDto } from 'src/dto/create-task.dto';
import { UpdateTaskDto } from 'src/dto/update-task.dto';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  const mockTaskService = {
    create: jest.fn(),
    findAllByList: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [{ provide: TaskService, useValue: mockTaskService }],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call taskService.create with user.id and dto', async () => {
      const user = { id: 'user-123' };
      const dto: CreateTaskDto = {
        title: 'Nova tarefa',
        listId: 'list-1',
        position: 1,
        status: 'todo',
      };
      const expectedResult = { id: 'task-1', ...dto, creatorId: user.id };

      mockTaskService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(user, dto);

      expect(service.create).toHaveBeenCalledWith(user.id, dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call taskService.findAllByList with listId', async () => {
      const listId = 'list-1';
      const expectedTasks = [{ id: 'task-1' }, { id: 'task-2' }];

      mockTaskService.findAllByList.mockResolvedValue(expectedTasks);

      const result = await controller.findAll(listId);

      expect(service.findAllByList).toHaveBeenCalledWith(listId);
      expect(result).toEqual(expectedTasks);
    });
  });

  describe('findOne', () => {
    it('should call taskService.findOne with task id', async () => {
      const id = 'task-1';
      const expectedTask = { id, title: 'Tarefa' };

      mockTaskService.findOne.mockResolvedValue(expectedTask);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedTask);
    });
  });

  describe('update', () => {
    it('should call taskService.update with id and dto', async () => {
      const id = 'task-1';
      const dto: UpdateTaskDto = { title: 'Atualizado' };
      const updatedTask = { id, title: 'Atualizado' };

      mockTaskService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(id, dto);

      expect(service.update).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual(updatedTask);
    });
  });

  describe('remove', () => {
    it('should call taskService.remove with id', async () => {
      const id = 'task-1';
      const removed = { id };

      mockTaskService.remove.mockResolvedValue(removed);

      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(removed);
    });
  });
});
