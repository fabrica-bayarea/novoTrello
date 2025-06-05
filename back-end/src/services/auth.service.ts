import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/services/prisma.service';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  SignInDto,
  SignUpDto,
} from 'src/dto/auth.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import * as nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';
import { resolveTemplatePath } from 'src/utils/path.helper';

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
  private async findOrCreateUser(data: any, provider: any): Promise<any> {
    let user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          userName: data.email.split('@')[0],
          passwordHash: provider === 'local' ? data.password : data.providerId,
          providerId: provider === 'local' ? null : data.providerId,
          role: 'ADMIN',
          authProvider: provider,
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
      !user.passwordHash ||
      user.authProvider !== 'local' ||
      !(await argon2.verify(user.passwordHash, dto.password));

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

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: forgotPasswordDto.email },
    });

    if (!user) {
      throw new ForbiddenException('Email não encontrado');
    }

    const newPassword = randomBytes(4).toString('hex'); // 8 caracteres

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    const templatePath = resolveTemplatePath('forgot-password.template.html');
    let emailHtml = fs.readFileSync(templatePath, 'utf8');

    emailHtml = emailHtml.replace('{{newPassword}}', newPassword);

    try {
      await transporter.sendMail({
        from: `"Suporte novoTrello" <${process.env.EMAIL}>`,
        to: forgotPasswordDto.email,
        subject: 'Recuperação de senha',
        html: emailHtml,
        attachments: [
          {
            filename: 'bayarea-logo.png',
            path: 'src/assets/bayarea-logo.png',
            cid: 'bayarea-logo',
          },
          {
            filename: 'iesb-logo.png',
            path: 'src/assets/iesb-logo.png',
            cid: 'iesb-logo',
          },
        ],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao enviar o e-mail de recuperação. Erro: ' + error,
      );
    }

    const newPasswordHash = await argon2.hash(newPassword);

    await this.prisma.user.update({
      where: { email: forgotPasswordDto.email },
      data: { passwordHash: newPasswordHash },
    });
  }

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
