import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guarda de autenticação para o callback do login via Google.
 * 
 * Essa classe estende o `AuthGuard` do Passport usando a estratégia 'google'.
 * O método `canActivate` verifica se a autenticação pode ser ativada antes de permitir o acesso.
 */
@Injectable()
export class GoogleOAuthCallbackGuard extends AuthGuard('google') {
  /**
   * Método responsável por validar se a autenticação pode ser ativada.
   * 
   * @param context O contexto da execução do request.
   * @returns `true` se a autenticação for bem-sucedida, `false` caso contrário.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activate = await super.canActivate(context);
    return Boolean(activate); // Converte o resultado em um booleano explícito.
  }
}
