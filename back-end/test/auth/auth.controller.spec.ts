import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { SignUpDto } from '../../src/auth/dto/signup.dto';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from 'src/auth/dto/signin.dto';
import { access } from 'fs';

describe('AuthController', () => {
  let controller: AuthController;

  const mockResponse: Partial<Response> = {
    cookie: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  const mockAuthService = {
    signUp: jest.fn(),
    signIn: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'NODE_ENV') return 'development';
      if (key === 'BASE_URL') return 'http://localhost';
      if (key === 'BASE_URL_UI') return 'http://localhost:3001';
      return null;
    }),
  };

  const mockJwtService = {
    verify: jest.fn(),
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    controller = module.get<AuthController>(AuthController);
  });
  describe('signUp', () => {
    it('deve retornar sucesso e definir cookie ao cadastrar usuário', async () => {
      const dto: SignUpDto = {
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
        userName: 'testuser',
      };
      mockAuthService.signUp.mockResolvedValue({
        accessToken: 'mocked-token',
      });

      const result = await controller.signUp(dto, mockResponse as Response);

      expect(mockAuthService.signUp).toHaveBeenCalledWith(dto);
      
    });
  });

  describe('signIn', () => {
    it('should call authService.signIn with the correct DTO', async () => {
      const dto: SignInDto = {
        email: 'test@test.com',
        password: '123456',
        rememberMe: true,
      };

      mockAuthService.signIn.mockResolvedValue({
        accessToken: 'mocked-token',
      })

      const result = await controller.signIn(dto, mockResponse as Response);

      expect(mockAuthService.signIn).toHaveBeenCalledWith(dto);
      
    })
  })

  it('deve lançar BadRequestException se email ou senha forem ausentes', async () => {
    const dto = { email: '', password: '', name: '', userName: '' };

    await expect(
      controller.signUp(dto as SignUpDto, mockResponse as Response),
    ).rejects.toThrow('Email e senha são obrigatórios');
  });
})
