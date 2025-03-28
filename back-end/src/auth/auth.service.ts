import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  /**
   * Realiza o login via Google OAuth.
   * Caso o usuário não exista no banco de dados, ele é criado automaticamente.
   *
   * @param req Objeto de requisição contendo as informações do usuário autenticado via Google.
   * @returns Retorna os dados do usuário autenticado ou uma mensagem de erro caso a autenticação falhe.
   */
  async googleLogin(req): Promise<User | string> {
    if (!req.user) {
      return 'No user from Google';
    }

    const { firstName, lastName, email, google_id, accessToken } = req.user;
    const nome = `${firstName} ${lastName}`;

    // Verifica se o usuário já existe no banco de dados
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Se o usuário não existir, cria um novo registro
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

  /**
   * Realiza o login via Microsoft OAuth.
   * Caso o usuário não exista no banco de dados, ele é criado automaticamente.
   *
   * @param req Objeto de requisição contendo as informações do usuário autenticado via Microsoft.
   * @returns Retorna os dados do usuário autenticado ou uma mensagem de erro caso a autenticação falhe.
   */
  async microsoftLogin(req): Promise<User | string> {
    if (!req.user) {
      return 'No user from Microsoft';
    }

    const { microsoftId, email, nome, accessToken } = req.user;

    // Verifica se o usuário já existe no banco de dados
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Se o usuário não existir, cria um novo registro
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
