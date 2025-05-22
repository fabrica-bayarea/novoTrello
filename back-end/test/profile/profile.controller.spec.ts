import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from '../../src/controllers/profile.controller';
import { ProfileService } from '../../src/services/profile.service';
import { ProfileDto } from '../../src/dto/profile.dto';

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: ProfileService;

  const mockProfileService = {
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
    deleteProfile: jest.fn(),
  };

  const mockUser = {
    id: 'user-123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    service = module.get<ProfileService>(ProfileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('should return the user profile', async () => {
      const mockProfile = {
        name: 'João',
        userName: 'joaosilva',
        email: 'joao@email.com',
      };

      mockProfileService.getProfile.mockResolvedValue(mockProfile);

      const result = await controller.getUserProfile({ user: mockUser });

      expect(service.getProfile).toHaveBeenCalledWith('user-123');
      expect(result).toEqual(mockProfile);
    });
  });

  describe('updateProfile', () => {
    it('should update the user profile and return a success message', async () => {
      const dto: ProfileDto = {
        name: 'João Atualizado',
        userName: 'joaoupdated',
        email: 'joao@novo.com',
      };

      mockProfileService.updateProfile.mockResolvedValue(dto);

      const result = await controller.updateProfile({ user: mockUser }, dto);

      expect(service.updateProfile).toHaveBeenCalledWith('user-123', dto);
      expect(result).toEqual({
        message: 'Perfil atualizado com sucesso.',
        data: dto,
      });
    });
  });

  describe('deleteProfile', () => {
    it('should delete the user profile and return a success message', async () => {
      mockProfileService.deleteProfile.mockResolvedValue({});

      const result = await controller.deleteProfile({ user: mockUser });

      expect(service.deleteProfile).toHaveBeenCalledWith('user-123');
      expect(result).toEqual({ message: 'Conta deletada com sucesso.' });
    });
  });
});
