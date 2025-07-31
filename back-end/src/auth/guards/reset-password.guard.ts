// src/auth/guards/reset-password.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { ResetPasswordPayload } from 'src/types/jwt-payload.interface';
import { Request } from 'express';

@Injectable()
export class ResetPasswordGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context
      .switchToHttp()
      .getRequest<Request & { user?: ResetPasswordPayload }>();

    let token: string | undefined;

    if (request.cookies && typeof request.cookies['reset_token'] === 'string') {
      token = request.cookies['reset_token'];
    } else if (Array.isArray(request.cookies?.['reset_token'])) {
      token = String(request.cookies['reset_token'][0]);
    } else {
      token = undefined;
    }

    if (typeof token !== 'string' || !token) {
      throw new UnauthorizedException('Token de redefinição não fornecido.');
    }

    try {
      const secret = this.configService.get<string>('JWT_RESET_SECRET');
      if (!secret) {
        throw new Error('JWT_RESET_SECRET não configurado.');
      }

      const payload: ResetPasswordPayload = this.jwtService.verify(token, {
        secret: secret,
      });

      if (payload.purpose !== 'reset-password') {
        throw new UnauthorizedException(
          'Este token não é válido para redefinir a senha.',
        );
      }

      request.user = payload;
      return true;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'TokenExpiredError') {
          throw new UnauthorizedException(
            'Token de redefinição expirado ou inválido.',
          );
        }
        if (error.name === 'JsonWebTokenError') {
          throw new UnauthorizedException('Token de redefinição inválido.');
        }

        throw new BadRequestException(
          'Erro ao validar token de redefinição: ' + String(error),
        );
      }
      throw new BadRequestException(
        'Erro desconhecido ao validar token de redefinição.',
      );
    }
  }
}
