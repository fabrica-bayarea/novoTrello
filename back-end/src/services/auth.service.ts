import {
    BadRequestException,
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import { JwtService } from '@nestjs/jwt';
  import { PrismaService } from 'src/services/prisma.service';
  import {
    SignInUsuarioDto,
    SignUpUsuarioDto,
  } from 'src/dto/auth.dto';
  import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
  import * as argon2 from "argon2";

  @Injectable()
  export class AuthService {
    constructor(
      private prisma: PrismaService,
      private jwt: JwtService,
      private config: ConfigService,
    ) {}
  
    async signToken(
      idUsuario: number,
    ): Promise<{ access_token: string }> {
      const payload = {
        sub: idUsuario,
      };
  
      const token = await this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
      });
      return {
        access_token: token,
      };
    }
  
    async signUpUsuario(
      dto: SignUpUsuarioDto,
    ): Promise<{ access_token: string }> {
      const hash = await argon2.hash(dto.senha);
      try {
        const dadosUsuario: any = {
          name: dto.name,
          email: dto.email,
          senha: hash,
        };
  
        const usuario = await this.prisma.user.create({
          data: dadosUsuario,
        });
  
        return this.signToken(usuario.id);
      } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
          if (err.code === 'P2002') {
            throw new ForbiddenException('Credenciais tomadas');
          }
        }
        throw err;
      }
    }
  
    async signInUsuario(
      dto: SignInUsuarioDto,
    ): Promise<{ access_token: string }> {
      const usuario = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (!usuario) {
        throw new ForbiddenException('Credenciais inválidas');
      }

      const senhaCorreta = await argon2.verify(usuario.senha, dto.senha);
      if (!senhaCorreta) throw new ForbiddenException('Credenciais incorretas');
      return this.signToken(usuario.id);
    }
  }