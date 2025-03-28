import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';
import { ConfigService } from '@nestjs/config';

/**
 * Estratégia de autenticação via Microsoft.
 * 
 * Essa classe estende `PassportStrategy` para configurar a autenticação OAuth com a Microsoft.
 */
@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('MICROSOFT_CLIENT_ID') || '', // ID do cliente registrado na Microsoft
      clientSecret: configService.get<string>('MICROSOFT_CLIENT_SECRET') || '', // Chave secreta do cliente
      callbackURL: 'http://localhost:3000/auth/microsoft-redirect', // URL de redirecionamento após login
      scope: ['user.read'], // Permissão para acessar informações básicas do usuário
      tenant: 'common', // Suporte para múltiplos tenants (pode ser alterado para um específico)
      passReqToCallback: true, // Permite acessar o objeto de requisição no método `validate`
    });
  }

  /**
   * Método responsável por validar a resposta da Microsoft e extrair os dados do usuário.
   * 
   * @param req Objeto da requisição.
   * @param accessToken Token de acesso retornado pela Microsoft.
   * @param refreshToken Token de atualização (não utilizado aqui).
   * @param profile Perfil do usuário retornado pela Microsoft.
   * @param done Função de callback para finalizar o processo de autenticação.
   */
  async validate(req: any, accessToken: string, refreshToken: string, profile: any, done: Function) {
    const { id, displayName, emails } = profile;

    const user = {
      microsoftId: id,
      email: emails[0].value,
      nome: displayName,
      accessToken,
    };

    done(null, user); 
  }
}
