import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/services/prisma.service';
import { SignInDto, SignUpDto } from 'src/dto/auth.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Gera um token JWT com base no payload fornecido.
   */
  private async generateJwt(
    user: User,
    rememberMe = false,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
      userName: user.userName,
    };
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: rememberMe ? '30d' : '1d',
        algorithm: 'HS256',
      }),
    };
  }

  /**
   * Gera um hash seguro para a senha usando Argon2.
   */
  private async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });
  }

  /**
   * Busca um usuário pelo email ou cria um novo, dependendo do provedor de autentica-
   * ção é guardado o providerId em vez da senha.
   */
  private async findOrCreateUser(data: any, provider: any): Promise<any> {
    let user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          fullName: data.fullName,
          userName: data.email.split('@')[0],
          email: data.email,
          authProvider: provider,
          providerId: data.providerId || null,
          password: provider === 'local' ? data.password : '',
        },
      });
    }

    return user;
  }

  /**
   * Trata erros específicos ao criar um usuário.
   */
  private handleSignUpError(error: any): never {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ForbiddenException('Email ou nome de usuário já estão em uso');
    }
    throw new BadRequestException('Erro ao criar usuário');
  }

  /**
   * Registra um novo usuário localmente.
   */
  async signUp(dto: SignUpDto): Promise<{ accessToken: string }> {
    const hashedPassword = await this.hashPassword(dto.password);

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (user) {
      throw new ForbiddenException('Email já cadastrado');
    }

    try {
      const user = await this.findOrCreateUser(
        { ...dto, password: hashedPassword },
        'local',
      );
      return this.generateJwt(user);
    } catch (error) {
      this.handleSignUpError(error);
    }
  }

  /**
   * Realiza login de um usuário local.
   */
  async signIn(dto: SignInDto): Promise<{ accessToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    const isInvalidCredentials =
      !user ||
      !user.password ||
      user.authProvider !== 'local' ||
      !(await argon2.verify(user.password, dto.password));

    if (isInvalidCredentials) {
      throw new ForbiddenException('Credenciais inválidas');
    }

    return this.generateJwt(user, dto.rememberMe);
  }

  /**
   * Realiza login com um provedor externo (Google, Microsoft, etc.).
   */
  async signInWithProvider(
    provider: string,
    req: { providerId: string; email: string; name: string },
  ): Promise<{ accessToken: string }> {
    if (!req.email) {
      throw new ForbiddenException(`No user from ${provider}`);
    }

    const user = await this.findOrCreateUser(req, provider);

    return this.generateJwt(user);
  }
}
