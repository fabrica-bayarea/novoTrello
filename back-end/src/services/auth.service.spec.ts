import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/services/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from 'src/dto/auth.dto';
import * as argon2 from 'argon2';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('fake-jwt-token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('deve criar um usuário com role USER por padrão', async () => {
    const dto: SignUpDto = {
      name: 'Teste',
      email: 'teste@email.com',
      password: '123456',
      userName: '',
    };

    const hashedPassword = await argon2.hash(dto.password);

    // simula que o usuário ainda não existe
    (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

    // simula retorno da criação
    (prismaService.user.create as jest.Mock).mockResolvedValue({
      id: '123',
      email: dto.email,
      name: dto.name,
      userName: 'teste',
      passwordHash: hashedPassword,
      authProvider: 'local',
      providerId: null,
      role: 'USER', // <- aqui o importante
    });

    const result = await authService.signUp(dto);

    expect(result).toEqual({ accessToken: 'fake-jwt-token' });
    expect(prismaService.user.create).toHaveBeenCalledWith({
      data: {
        email: dto.email,
        name: dto.name,
        userName: 'teste',
        passwordHash: expect.any(String),
        providerId: null,
        role: 'USER',
        authProvider: 'local',
      },
    });
  });
});
