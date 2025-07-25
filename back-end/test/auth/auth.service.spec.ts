import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/services/auth.service';
import { PrismaService } from 'src/services/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../../src/services/email.service';
import * as argon2 from 'argon2';
import { ForbiddenException } from '@nestjs/common';
import { User } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  let mockUser: User;

  beforeEach(async () => {
    const passwordHash = await argon2.hash('validpassword');
    mockUser = {
      id: 'user-id-1',
      email: 'test@example.com',
      name: 'Test User',
      userName: 'testuser',
      passwordHash,
      authProvider: 'local',
      providerId: null,
      CreatedAt: new Date(),
      isVerified: true,
      resetToken: null,
      resetTokenExpiresAt: null,
      role: 'ADMIN',
      updatedAt: new Date(),
      image: null,
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('fake-jwt-token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('secret'),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendForgotPasswordEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('signIn', () => {
    it('should return a token when credentials are valid', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({ ...mockUser });

      const result = await service.signIn({
        email: 'test@example.com',
        password: 'validpassword',
        rememberMe: false,
      });

      expect(result).toEqual({ accessToken: 'fake-jwt-token' });
    });

    it('should throw ForbiddenException for invalid credentials', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({ ...mockUser });

      await expect(
        service.signIn({
          email: 'test@example.com',
          password: 'wrongpassword',
          rememberMe: false,
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if user is not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(
        service.signIn({
          email: 'notfound@example.com',
          password: 'whatever',
          rememberMe: false,
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
