import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('MICROSOFT_CLIENT_ID') || '',
      clientSecret: configService.get<string>('MICROSOFT_CLIENT_SECRET') || '',
      callbackURL: 'http://localhost:3000/auth/microsoft-redirect',
      scope: ['user.read'],
      tenant: 'common',
      passReqToCallback: true,
    });
  }

  async validate(req: any, accessToken: string, refreshToken: string, profile: any, done: Function) {
    const { id, displayName, emails } = profile;

    const user = {
      microsoftId: id,
      email: emails[0].value,
      nome: displayName,
      accessToken,
    };

    done(null, user);
  }
}
