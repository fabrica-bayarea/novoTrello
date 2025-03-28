import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guarda de autenticação para o callback do login via Microsoft.
 * 
 * Esta classe estende o `AuthGuard` do Passport usando a estratégia 'microsoft'.
 * O método `canActivate` chama a autenticação padrão e retorna um valor booleano
 * para indicar se o processo de autenticação foi bem-sucedido.
 */
@Injectable()
export class MicrosoftOAuthCallbackGuard extends AuthGuard('microsoft') {
  /**
   * Método que verifica se a autenticação pode ser ativada.
   * 
   *@param context O contexto da execução da requisição.
   * @returns Um booleano indicando se a autenticação foi bem-sucedida.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activate = await super.canActivate(context);
    return Boolean(activate);
  }
}
