import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

/**
 * Estratégia de autenticação via Google.
 * 
 * Essa classe estende `PassportStrategy` para configurar a autenticação OAuth com o Google.
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || '', // ID do cliente registrado no Google
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || '', // Chave secreta do cliente
      callbackURL: 'http://localhost:3000/auth/google-redirect', // URL de redirecionamento após login
      scope: ['email', 'profile'], // Permissões para acessar email e perfil do usuário
      passReqToCallback: true, // Permite acessar o objeto de requisição no método `validate`
    });
  }

  /**
   * Método responsável por validar a resposta do Google e extrair os dados do usuário.
   * 
   * @param req Objeto da requisição.
   * @param accessToken Token de acesso retornado pelo Google.
   * @param refreshToken Token de atualização (não utilizado aqui).
   * @param profile Perfil do usuário retornado pelo Google.
   * @param done Função de callback para finalizar o processo de autenticação.
   * @returns Retorna um objeto representando o usuário autenticado.
   */
  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, id } = profile;

    // Criação do objeto usuário com os dados recebidos do Google
    const user = {
      google_id: id, // ID do usuário no Google
      email: emails[0].value, // Primeiro email associado à conta
      nome: `${name.givenName} ${name.familyName}`, // Nome completo do usuário
      access_token: accessToken, // Token de acesso fornecido pelo Google
    };

    done(null, user);
  }
}
