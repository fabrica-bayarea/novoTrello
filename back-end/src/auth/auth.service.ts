import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}
  
  async validateUser(email: string, senha: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
  
    if (!user) {
      return null;
    }
  
    const senhaValida = user.senha ? await bcrypt.compare(senha, user.senha) : false;
    if (!senhaValida) {
      return null;
    }
  
    return user;
  }
  async login(email: string, senha: string) {

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.senha) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }


    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }


    const token = this.jwtService.sign({ id: user.id, email: user.email });

    return { message: 'Login realizado com sucesso!', token };
  }
  
  async googleLogin(req): Promise<User | string> {
    if (!req.user) {
      return 'No user from Google';
    }

    const { firstName, lastName, email, google_id, accessToken } = req.user;
    const nome = `${firstName} ${lastName}`;

    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name: nome,
          email,
          authProvider: 'google',
          googleId: google_id,
          accessToken: accessToken,
          senha: null,
        },
      });
    }

    return user as User;
  }
  async microsoftLogin(req): Promise<User | string> {
    if (!req.user) {
      return 'No user from Microsoft';
    }
  
    const { microsoftId, email, nome, accessToken } = req.user;
  
    let user = await this.prisma.user.findUnique({
      where: { email },
    });
  
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name: nome,
          email,
          authProvider: 'microsoft',
          microsoftId,
          accessToken,
          senha: null,
        },
      });
    }
  
    return user as User;
  }
}
