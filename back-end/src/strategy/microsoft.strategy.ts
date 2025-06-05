import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('MICROSOFT_CLIENT_ID'),
      clientSecret: configService.get<string>('MICROSOFT_CLIENT_SECRET'),
      callbackURL: `${configService.get<string>('BASE_URL_API')}/v1/auth/microsoft/callback`,
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