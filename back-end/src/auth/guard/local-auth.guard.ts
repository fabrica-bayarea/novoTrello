import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isActive = await super.canActivate(context);
    if (!isActive) {
      throw new UnauthorizedException('Falha na autenticação local.');
    }
    return true;
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }
    return user;
  }
}
