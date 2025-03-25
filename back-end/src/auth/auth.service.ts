import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  SignInUsuarioDto,
  SignUpUsuarioDto,
  SignInConvidadoDto,
  SignUpConvidadoDto,
  SignInAdministradorDto,
  SignUpAdministradorDto,
  TiposDeConvidado
} from 'src/DTO/auth.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';
import { Convidado, TipoUsuario } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signToken(
    idUsuario: number,
    tipo: 'ADMINISTRADOR' | 'CADASTRADOR' | 'CONVIDADO',
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: idUsuario,
      tipo,
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
  ): Promise<{ access_token: string } | never> {
    const hash = await argon.hash(dto.senha);
    try {
      const dadosUsuario: any = {
        nome: dto.nome,
        email: dto.email,
        tipo: dto.tipo,
        hash: hash,
      };

      const usuario = await this.prisma.usuario.create({
        data: dadosUsuario,
      });

      delete dadosUsuario.hash;
      return this.signToken(usuario.id, 'CADASTRADOR');
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Credenciais tomadas');
        }
      }
      throw err;
    }
  }

  async signUpAdministrador(
    dto: SignUpAdministradorDto,
  ): Promise<{ access_token: string } | never> {
    const hash = await argon.hash(dto.senha);
    try {
      const dadosAdmin: any = {
        nome: dto.nome,
        email: dto.email,
        tipo: dto.tipo,
        hash: hash,
      };

      const administrador = await this.prisma.administrador.create({
        data: dadosAdmin,
      });

      delete dadosAdmin.hash;
      return this.signToken(administrador.id, 'ADMINISTRADOR');
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Credenciais tomadas');
        }
      }
      throw err;
    }
  }

  async signUpBeneficiario(
    dto: SignUpConvidadoDto,
  ): Promise<{ access_token: string } | never> {
    const hash = await argon.hash(dto.senha);
    try {
      const dadosConvidado: any = {
        nome: dto.nome,
        email: dto.email,
        tipo: dto.tipo,
        hash: hash,
      };
      const convidado = await this.prisma.convidado.create({
        data: dadosConvidado,
      });

      delete dadosConvidado.hash;
      return this.signToken(convidado.id, 'CONVIDADO');
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
  ): Promise<{ access_token: string } | never> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    if (!usuario) throw new ForbiddenException('Credenciais inválidas');

    const senhaCorreta = await argon.verify(usuario.hash, dto.senha);

    if (!senhaCorreta) throw new ForbiddenException('Credenciais incorretas');
    return this.signToken(usuario.id, usuario.);
  }

  async signInAdmin(
    dto: SignInAdministradorDto
  ): Promise<{ access_token: string } | never> {
    const administrador = await this.prisma.administrador.findUnique({
      where: { email: dto.email },
    });

    if (!administrador) throw new ForbiddenException('Credenciais inválidas');

    const senhaCorreta = await argon.verify(administrador.hash, dto.senha);

    if (!senhaCorreta) throw new ForbiddenException('Credenciais incorretas');
    return this.signToken(administrador.id, "ADMINISTRADOR");
  }

  async signInBeneficiario(
    dto: SignInConvidadoDto,
  ): Promise<{ access_token: string } | never> {
    if (!dto.email) {
      throw new BadRequestException('É necessário fornecer email.');
    }

    let convidado: Convidado;

      convidado = await this.prisma.convidado.findUnique({
        where: { email: dto.email },
      });

    if (!TiposDeConvidado) {
      throw new ForbiddenException('Credenciais inválidas');
    }

    const senhaCorreta = await argon.verify(convidado.hash, dto.senha);

    if (!senhaCorreta) {
      throw new ForbiddenException('Credenciais incorretas');
    }

    return this.signToken(convidado.id, "CONVIDADO");
  }

  async isAdministrator(idUsuario: number): Promise<boolean> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: idUsuario },
    });

    return usuario?.tipo === 'ADMINISTRADOR';
  }

  async isCadastrador(idUsuario: number): Promise<boolean> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: idUsuario },
    });

    return usuario?.tipo === 'USUARIO';
  }
}
