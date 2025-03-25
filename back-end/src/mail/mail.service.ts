import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail() {
    try {
      await this.mailerService.sendMail({
        to: 'gabrielfernandes21251@gmail.com',
        from: '"TesteBayArea" <testebayarea@gmail.com>', 
        subject: 'Teste de envio de e-mail', 
        text: '', 
        html: '<p>Teste de envio de e-mail feito com nest.js</p>',
      });
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
      };
    }
  }
}