import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/services/prisma.service';
import { SignInDto, SignUpDto } from 'src/dto/auth.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon2 from "argon2";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  private async signToken(
    userId: number,
    rememberMe = false,
  ): Promise<{ access_token: string }> {
    const payload = { sub: userId };
    const expiresIn = rememberMe ? '30d' : '1d';

    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn
      })
    };
  }

  async signUp(
    dto: SignUpDto,
  ): Promise<{ access_token: string }> {
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
          password: hashedPassword,
        },
      });

      return this.signToken(user.id);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ForbiddenException('Email ou nome de usuário já estão em uso');
      }
      throw new BadRequestException('Erro ao criar usuário');
    }
  }

  async signIn(
    dto: SignInDto,
  ): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await argon2.verify(user.password, dto.password))) {
      throw new ForbiddenException('Credenciais inválidas');
    }

    return this.signToken(user.id, dto.rememberMe);
  }
}