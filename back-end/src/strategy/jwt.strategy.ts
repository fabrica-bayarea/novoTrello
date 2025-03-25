import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import {Administrador, Convidado, PrismaClient, Usuario} from '@prisma/client'

const prisma = new PrismaClient();
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: {
    sub: number;
    tipo: 'ADMINISTRADOR' | 'USUARIO' | 'CONVIDADO';
  }): Promise<Usuario | Convidado | Administrador> {
    if (
      !['ADMINISTRADOR', 'USUARIO', 'CONVIDADO'].includes(payload.tipo)
    ) {
      throw new UnauthorizedException('Tipo de usuário inválido');
    }

    let usuario: Usuario | Convidado | Administrador;
    try {
      switch (payload.tipo) {
        case 'ADMINISTRADOR':
          usuario = await this.prisma.administrador.findUnique({
            where: {
              id: payload.sub,
            },
          });
          break;
        case 'USUARIO':
          usuario = await this.prisma.usuario.findUnique({
            where: {
              id: payload.sub,
            },
          });
          break;
        case 'CONVIDADO':
          usuario = await this.prisma.convidado.findUnique({
            where: {
              id: payload.sub,
            },
          });
          break;
      }
    } catch (err) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    if (!usuario || typeof usuario !== 'object') {
      throw new UnauthorizedException('Usuário inválido');
    }

    delete usuario.hash;
    return usuario;
  }
}
