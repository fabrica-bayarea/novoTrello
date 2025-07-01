import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    const isProduction = configService.get<string>('NODE_ENV') === 'production';

    const baseUrl = configService.get<string>('BASE_URL') || 'http://localhost';
    const baseurlApi = configService.get<string>('BASE_URL_API') || 'http://localhost:3000';
    const ProductionBaseUrl = `${baseUrl}/api/v1/auth/google/callback`;
    const DevelopmentBaseUrl = `${baseurlApi}/v1/auth/google/callback`;
    const callbackURL = isProduction ? ProductionBaseUrl : DevelopmentBaseUrl;

    if (!clientID || !clientSecret || !baseUrl) {
      throw new Error('Google OAuth configuration is missing');
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
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