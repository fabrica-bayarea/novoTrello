import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(private readonly configService: ConfigService) {
    const clientID = configService.get<string>('MICROSOFT_CLIENT_ID');
    const clientSecret = configService.get<string>('MICROSOFT_CLIENT_SECRET');
    const isProduction = configService.get<string>('NODE_ENV') === 'production';
    
    const baseUrl = configService.get<string>('BASE_URL') || 'http://localhost';
    const baseurlApi = configService.get<string>('BASE_URL_API') || 'http://localhost:3000';
    const ProductionBaseUrl = `${baseUrl}/api/v1/auth/microsoft/callback`;
    const DevelopmentBaseUrl = `${baseurlApi}/v1/auth/microsoft/callback`;
    const callbackURL = isProduction ? ProductionBaseUrl : DevelopmentBaseUrl;

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['user.read'],
      tenant: 'common',
      passReqToCallback: true,
    });
  }

  async validate(
    req: any, 
    accessToken: string, 
    refreshToken: string, 
    profile: any, 
    done: Function
  ): Promise<any>{
    if (!profile || !profile.displayName || !profile.emails || !profile.id) {
      return done(new Error('Perfil da Microsoft está incompleto ou inválido'), false);
    }

    const user = {
      microsoftId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      accessToken,
    };

    done(null, user); 
  }
}