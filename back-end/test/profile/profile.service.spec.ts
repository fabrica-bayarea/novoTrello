import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from '../../src/services/profile.service';
import { PrismaService } from '../../src/services/prisma.service';
import { ProfileDto } from '../../src/dto/profile.dto';

describe('ProfileService', () => {
  let service: ProfileService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return the user profile', async () => {
      const mockUser = {
        id: '1',
        name: 'João',
        userName: 'joao123',
        email: 'joao@email.com',
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getProfile('1');
      expect(result).toEqual({
        name: mockUser.name,
        userName: mockUser.userName,
        email: mockUser.email,
      });
    });

    it('should throw error if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getProfile('1')).rejects.toThrow(
        'Usuário não encontrado',
      );
    });
  });

  describe('updateProfile', () => {
    it('must update and return the user profile', async () => {
      const dto: ProfileDto = {
        name: 'Novo Nome',
        userName: 'novoUser',
        email: 'novo@email.com',
      };

      const updatedUser = { id: '1', ...dto };

      mockPrisma.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateProfile('1', dto);
      expect(result).toEqual(updatedUser);
    });

    it('should throw error if update fails', async () => {
      mockPrisma.user.update.mockResolvedValue(null);

      await expect(
        service.updateProfile('1', {
          name: 'Test',
          userName: 'testuser',
          email: 'test@email.com',
        }),
      ).rejects.toThrow('Erro ao atualizar o perfil');
    });
  });

  describe('deleteProfile', () => {
    it('must delete and return the deleted profile', async () => {
      const deletedUser = {
        id: '1',
        name: 'Deletado',
        userName: 'deletado',
        email: 'deletado@email.com',
      };

      mockPrisma.user.delete.mockResolvedValue(deletedUser);

      const result = await service.deleteProfile('1');
      expect(result).toEqual(deletedUser);
    });

    it('should throw error if deletion fails', async () => {
      mockPrisma.user.delete.mockResolvedValue(null);

      await expect(service.deleteProfile('1')).rejects.toThrow(
        'Erro ao deletar o perfil',
      );
    });
  });
});
