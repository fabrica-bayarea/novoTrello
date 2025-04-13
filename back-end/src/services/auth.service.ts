import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/services/prisma.service';
import { SignInDto, SignUpDto, SignResponseJwtDto } from 'src/dto/auth.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon2 from "argon2";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  private async generateAuthToken(
    userId: number,
    rememberMe = false,
  ): Promise<{ accessToken: string; expiresIn: string; createdAt: string }> {
    const payload = { sub: userId };
    const expiresIn = rememberMe ? '30d' : '1d';

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn,
    });

    return {
      accessToken,
      expiresIn,
      createdAt: new Date().toISOString(),
    };
  }

  async signUp(
    dto: SignUpDto,
  ): Promise<SignResponseJwtDto> {
    const hashedPassword = await argon2.hash(dto.password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    try {
      const user = await this.prisma.user.create({
        data: {
          fullName: dto.fullName,
          userName: dto.userName,
          email: dto.email,
          authProvider: 'local',
          providerId: null,
          password: hashedPassword,
        },
      });

      return {
        access: await this.generateAuthToken(user.id, false),
        user: {
          id: user.id,
          fullName: user.fullName,
          userName: user.userName,
          email: user.email,
        },
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ForbiddenException('Email ou nome de usuário já estão em uso');
      }
      throw new BadRequestException('Erro ao criar usuário');
    }
  }

  async signInJwt(
    dto: SignInDto,
  ): Promise<SignResponseJwtDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || user.authProvider != "local" || !user.password || !(await argon2.verify(user.password, dto.password))) {
      throw new ForbiddenException('Credenciais inválidas');
    }

    return {
      access: await this.generateAuthToken(user.id, dto.rememberMe),
      user: {
        id: user.id,
        fullName: user.fullName,
        userName: user.userName,
        email: user.email,
      },
    };
  }

  async signInGoogle(
    req: { google_id: string; email: string; name: string; accessToken: string },
  ): Promise<SignResponseJwtDto | string> {
    if (!req.email) {
      return 'No user from Google';
    }

    const { google_id, email, name, accessToken } = req;

    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          fullName: name,
          userName: email.split('@')[0],
          email,
          authProvider: 'google',
          providerId: google_id,
          password: '',
        },
      });
    }

    return {
      access: await this.generateAuthToken(user.id, false),
      user: {
        id: user.id,
        fullName: user.fullName,
        userName: user.userName,
        email: user.email,
      },
    };
  }

  async signInMicrosoft(
    req: { microsoftId: string; email: string; name: string; accessToken: string }
  ): Promise<SignResponseJwtDto | string> {
    if (!req.email) {
      return 'No user from Microsoft';
    }

    const { microsoftId, email, name, accessToken } = req;

    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          fullName: name,
          email,
          userName: email.split('@')[0],
          authProvider: 'microsoft',
          providerId: microsoftId,
          password: '',
        },
      });
    }

    return {
      access: await this.generateAuthToken(user.id, false),
      user: {
        id: user.id,
        fullName: user.fullName,
        userName: user.userName,
        email: user.email,
      },
    };
  }
}