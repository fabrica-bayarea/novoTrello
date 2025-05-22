import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/controllers/auth.controller';
import { AuthService } from '../../src/services/auth.service';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SignUpDto,
  SignInDto,
  ForgotPasswordDto,
  ChangePasswordDto,
} from 'src/dto/auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signUp: jest.fn(),
    signIn: jest.fn(),
    forgotPassword: jest.fn(),
    changePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ConfigService, useValue: {} },
        { provide: Logger, useValue: { error: jest.fn(), log: jest.fn() } },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should call authService.signUp with the correct DTO', async () => {
      const dto: SignUpDto = {
        name: 'John Doe',
        userName: 'john',
        email: 'test@test.com',
        password: '123456',
      };
      mockAuthService.signUp.mockResolvedValue('mocked-token');

      const result = await controller.SignUp(dto);

      expect(mockAuthService.signUp).toHaveBeenCalledWith(dto);
      expect(result).toBe('mocked-token');
    });
  });

  describe('signIn', () => {
    it('should call authService.signIn with the correct DTO', async () => {
      const dto: SignInDto = {
        email: 'test@test.com',
        password: '123456',
        rememberMe: true,
      };
      mockAuthService.signIn.mockResolvedValue('mocked-token');

      const result = await controller.SignIn(dto);

      expect(mockAuthService.signIn).toHaveBeenCalledWith(dto);
      expect(result).toBe('mocked-token');
    });
  });

  describe('forgotPassword', () => {
    it('should call authService.forgotPassword with the correct DTO', async () => {
      const dto: ForgotPasswordDto = { email: 'test@example.com' };
      mockAuthService.forgotPassword.mockResolvedValue('email enviado');

      const result = await controller.forgotPassword(dto);

      expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(dto);
      expect(result).toBe('email enviado');
    });
  });

  describe('changePassword', () => {
    it('should call authService.changePassword with user id and dto', async () => {
      const userId = '123';
      const dto: ChangePasswordDto = {
        oldPassword: 'oldPass',
        newPassword: 'newPass',
      };
      const req = { user: { id: userId } };

      const result = await controller.changePassword(req, dto);

      expect(mockAuthService.changePassword).toHaveBeenCalledWith(userId, dto);
      expect(result).toEqual({ message: 'Senha alterada com sucesso.' });
    });
  });
});
