import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Se estiver usando Prisma
import { MailerService } from '@nestjs-modules/mailer';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private mailerService: MailerService) {}

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const token = randomBytes(32).toString('hex');

    await this.prisma.user.update({
      where: { email },
      data: { resetPasswordToken: token, resetPasswordExpires: new Date(Date.now() + 3600000) }, // Expira em 1h
    });

    await this.mailerService.sendMail({
      to: email,
      subject: 'Redefinição de Senha',
      text: `Recebemos uma solicitação para redefinir a sua senha. Se você não fez essa solicitação, ignore este e-mail.\n\n` +
            `Para redefinir sua senha, clique no link abaixo:\n\n` +
            `http://localhost:3000/auth/reset-password?token=${token}\n\n` +
            `Se você não consegue visualizar o link, copie e cole o seguinte link no seu navegador:\n\n` +
            `http://localhost:3000/auth/reset-password?token=${token}`,
    });

    return { message: 'E-mail de recuperação enviado' };
  }
  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: { resetPasswordToken: token, resetPasswordExpires: { gt: new Date() } },
    });

    if (!user) {
      throw new Error('Token inválido ou expirado');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetPasswordToken: null, resetPasswordExpires: null },
    });

    return { message: 'Senha redefinida com sucesso' };
  }
}
