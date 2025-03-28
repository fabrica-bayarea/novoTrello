import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guarda de autenticação para o login via Microsoft.
 * 
 * Essa classe estende o AuthGuard do Passport usando a estratégia 'microsoft'.
 * Quando aplicada a uma rota, ela redireciona o usuário para a página de login da Microsoft
 * e lida automaticamente com o callback de autenticação.
 */
@Injectable()
export class MicrosoftOAuthGuard extends AuthGuard('microsoft') {}
