import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/services/auth.service';
import { PrismaService } from '../../src/services/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException } from '@nestjs/common';
import * as argon2 from 'argon2';

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mocked_token'),
};

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('deve lançar exceção se o e-mail já estiver cadastrado', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1' });

      await expect(
        service.signUp({
          email: 'test@example.com',
          password: '123456',
          name: 'Test User',
          userName: 'testuser',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('deve retornar token quando o usuário for criado com sucesso', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        userName: 'testuser',
        authProvider: 'local',
      });

      const result = await service.signUp({
        email: 'test@example.com',
        password: '123456',
        name: 'Test User',
        userName: 'testuser',
      });

      expect(result).toEqual({ accessToken: 'mocked_token' });
    });
  });

  describe('signIn', () => {
    it('deve lançar exceção se o usuário não for encontrado ou senha inválida', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.signIn({
          email: 'notfound@example.com',
          password: '123456',
          rememberMe: false,
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('deve retornar token se as credenciais forem válidas', async () => {
      const hash = await argon2.hash('123456');
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'valid@example.com',
        passwordHash: hash,
        authProvider: 'local',
        name: 'Valid User',
        userName: 'validuser',
      });

      const result = await service.signIn({
        email: 'valid@example.com',
        password: '123456',
        rememberMe: false,
      });

      expect(result).toEqual({ accessToken: 'mocked_token' });
    });
  });
});
