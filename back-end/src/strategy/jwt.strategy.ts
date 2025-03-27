import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/modules-prisma/prisma.service';
import { User, Administrador, Convidado } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private prisma: PrismaService,
  ) {
    const jwtSecret = config.get('JWT_SECRET'); // Pegando o JWT_SECRET do arquivo .env

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  // Aqui fazemos a validação do payload do JWT
  async validate(payload: { id: number; tipo: 'ADMINISTRADOR' | 'CADASTRADOR' | 'CONVIDADO' }): Promise<User | Convidado | Administrador> {
    let usuario: User | Convidado | Administrador;
    
    try {
      // Usando switch para determinar qual tipo de usuário buscar
      switch (payload.tipo) {
        case 'ADMINISTRADOR':
          usuario = await this.prisma.administrador.findUnique({
            where: { id: payload.id },
          });
          break;
        case 'CADASTRADOR':
          usuario = await this.prisma.user.findUnique({
            where: { id: payload.id },
          });
          break;
        case 'CONVIDADO':
          usuario = await this.prisma.convidado.findUnique({
            where: { id: payload.id },
          });
          break;
        default:
          throw new UnauthorizedException('Tipo de usuário não suportado');
      }
    } catch (err) {
      throw new UnauthorizedException('Erro ao buscar usuário no banco de dados');
    }
    return usuario;
  }
}
