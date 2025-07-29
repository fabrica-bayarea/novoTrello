import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { ForgotPasswordDto } from 'src/email/dto/forgot-password.dto';
import { ChangePasswordDto } from 'src/email/dto/change-password.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';
import 'dotenv/config';
import { VerifyResetCodeDto } from 'src/auth/dto/verify-reset-code.dto';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Gera um token JWT com base no payload fornecido.
   */
  private generateJwt(user: User, rememberMe = false): { accessToken: string } {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
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
  private async findOrCreateUser(
    data: {
      email: string;
      name: string;
      providerId?: string;
      password?: string;
    },
    provider: string,
  ): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!existingUser) {
      const userData = {
        email: data.email,
        name: data.name,
        userName: data.email.split('@')[0],
        passwordHash: provider === 'local' ? data.password! : data.providerId!,
        providerId: provider === 'local' ? null : data.providerId!,
        role: 'ADMIN' as const,
        authProvider: provider as 'local' | 'google' | 'microsoft',
      };

      const newUser = await this.prisma.user.create({
        data: userData,
      });
      return newUser;
    }

    return existingUser;
  }

  /**
   * Trata erros específicos ao criar um usuário.
   */
  private handleSignUpError(error: unknown): never {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Email ou nome de usuário já estão em uso');
    }
    throw new BadRequestException('Erro ao criar usuário');
  }

  /**
   * Registra um novo usuário localmente.
   */
  async signUp(dto: SignUpDto): Promise<{ accessToken: string }> {
    const hashedPassword = await this.hashPassword(dto.password);

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
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
      !user.passwordHash ||
      user.authProvider !== 'local' ||
      !(await argon2.verify(user.passwordHash, dto.password));

    if (isInvalidCredentials) {
      throw new UnauthorizedException('Credenciais inválidas');
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

  /**
   * Gera um código aleatório e envia por email para recuperação de senha.
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: forgotPasswordDto.email },
    });

    if (!user) {
      return;
    }

    const code = randomBytes(6).toString('base64');
    const expires = new Date(Date.now() + 1000 * 60 * 15);

    await this.prisma.user.update({
      where: { email: forgotPasswordDto.email },
      data: {
        resetToken: code,
        resetTokenExpiresAt: expires,
      },
    });

    await this.emailService.sendForgotPasswordEmail(
      forgotPasswordDto.email,
      code,
    );
  }

  /**
   * Verifica se o código de recuperação de senha é válido e gera um token JWT.
   */
  async verifyResetCode(
    verifyResetCodeDto: VerifyResetCodeDto,
  ): Promise<string> {
    const user = await this.prisma.user.findFirst({
      where: { resetToken: verifyResetCodeDto.code },
    });

    if (!user) {
      throw new ForbiddenException('Código inválido ou expirado.');
    }

    if (!user.resetToken || user.resetToken !== verifyResetCodeDto.code) {
      throw new UnauthorizedException('Código de verificação inválido.');
    }

    if (user.resetTokenExpiresAt && user.resetTokenExpiresAt < new Date()) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: null,
          resetTokenExpiresAt: null,
        },
      });
      throw new UnauthorizedException('Código de verificação expirado.');
    }

    const payload = {
      userId: user.id,
      email: user.email,
      purpose: 'reset-password',
    };

    const resetJwtToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: this.configService.get('JWT_RESET_SECRET'),
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });

    return resetJwtToken;
  }

  async resetPassword(userId: string, newPasswordPlain: string): Promise<void> {
    try {
      const hashedPassword = await this.hashPassword(newPasswordPlain);

      await this.prisma.user.update({
        where: { id: userId },
        data: { passwordHash: hashedPassword },
      });
    } catch (error) {
      throw new BadRequestException(
        'Erro ao redefinir a senha: ' + String(error),
      );
    }
  }

  /**
   * Altera a senha de um usuário após validar a senha atual.
   */
  async changePassword(id: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado.');
    }

    const isOldPasswordValid = await argon2.verify(
      user.passwordHash,
      dto.oldPassword,
    );
    if (!isOldPasswordValid) {
      throw new BadRequestException('Senha antiga incorreta.');
    }

    const hashedNewPassword = await argon2.hash(dto.newPassword);

    await this.prisma.user.update({
      where: { id },
      data: { passwordHash: hashedNewPassword },
    });
  }
}
