import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guarda de autenticação para login via Google.
 * 
 * Essa classe estende o `AuthGuard` do Passport usando a estratégia 'google'.
 * O acesso é configurado como 'offline' para permitir a renovação de tokens de acesso.
 */
@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  /**
   * Construtor que injeta o serviço de configuração do NestJS.
   * 
   * @param configService Serviço para acessar variáveis de ambiente e configurações.
   */
  constructor(private configService: ConfigService) {
    super({
      accessType: 'offline',
    });
  }
}
