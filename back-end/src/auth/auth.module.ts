import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { MicrosoftStrategy } from './strategies/microsoft.strategy';
import { MicrosoftOAuthGuard } from './guard/microsoft-oauth.guard';


@Module({
  imports: [ConfigModule.forRoot(), PassportModule.register({ defaultStrategy: 'google' }), AuthModule, JwtModule.register({
    secret: process.env.JWT_SECRET || 'chave-secreta',
    signOptions: { expiresIn: '1d' },
  }), ConfigModule.forRoot(),
  PassportModule.register({ defaultStrategy: 'local' }),
  JwtModule.register({
    secret: process.env.JWT_SECRET || 'chave-secreta',
    signOptions: { expiresIn: '1d' },
  }),],
  providers: [AuthService, LocalStrategy, GoogleStrategy, PrismaService, MicrosoftStrategy],
  controllers: [AuthController],
})
export class AuthModule { }
