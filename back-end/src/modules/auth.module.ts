import { DynamicModule, Module, Logger } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { GoogleStrategy } from 'src/strategy/google.strategy';
import { MicrosoftStrategy } from 'src/strategy/microsoft.strategy';
import { PrismaService } from 'src/services/prisma.service';
import { AuthService } from 'src/services/auth.service';
import { AuthController } from 'src/controllers/auth.controller';
import { EmailModule } from './email.module';

@Module({})
export class AuthModule {
  static register(): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        ConfigModule,
        PassportModule,
        EmailModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.getOrThrow<string>('JWT_SECRET'),
            signOptions: { expiresIn: '1d' },
          }),
        }),
      ],
      providers: [
        Logger,
        JwtStrategy,
        PrismaService,
        AuthService,
        {
          provide: 'OAUTH_STRATEGIES',
          useFactory: (configService: ConfigService) => [
            ...(configService.get<string>('ENABLE_GOOGLE_OAUTH') === 'true'
              ? [new GoogleStrategy(configService)]
              : []),
            ...(configService.get<string>('ENABLE_MICROSOFT_OAUTH') === 'true'
              ? [new MicrosoftStrategy(configService)]
              : []),
          ],
          inject: [ConfigService],
        },
      ],
      controllers: [AuthController],
      exports: [AuthService, JwtModule],
    };
  }
}
