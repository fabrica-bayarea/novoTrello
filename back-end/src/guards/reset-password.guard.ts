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
import { ResetPasswordPayload } from '../types/jwt-payload.interface';
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
    const request: Request = context.switchToHttp().getRequest();
    let token =
      request.query.token || request.headers.authorization?.split(' ')[1];

    if (Array.isArray(token)) {
      token = token[0];
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
        throw new ForbiddenException(
          'Este token não é válido para redefinir a senha.',
        );
      }

      request.user = payload;
      return true;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'TokenExpiredError') {
          throw new ForbiddenException('Token de redefinição expirado.');
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
