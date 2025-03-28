import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { MicrosoftStrategy } from './strategies/microsoft.strategy';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  // Importa módulos necessários para autenticação e configuração
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'google' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'chave-secreta', 
      signOptions: { expiresIn: '1d' },
    }),
  ],
  
  // Define os provedores disponíveis no módulo
  providers: [
    AuthService, 
    PrismaService, 
    GoogleStrategy, 
    MicrosoftStrategy, 
  ],
  
  // Define os controladores disponíveis no módulo
  controllers: [AuthController],
})
export class AuthModule {}
