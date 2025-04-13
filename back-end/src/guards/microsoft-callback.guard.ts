import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class MicrosoftOAuthCallbackGuard extends AuthGuard('microsoft') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activate = await super.canActivate(context);
    return Boolean(activate);
  }
}