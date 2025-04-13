import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
      callbackURL: 'http://localhost:3000/v1/auth/google/callback',
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }
  
  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    if (!profile || !profile.name || !profile.emails || !profile.id) {
      return done(new Error('Perfil do Google está incompleto ou inválido'), false);
    }

    const user = {
      google_id: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      access_token: accessToken,
    };

    done(null, user);
  }
}