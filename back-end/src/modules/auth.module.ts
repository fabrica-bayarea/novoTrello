import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { PrismaService } from 'src/services/prisma.service';
import { AuthService } from 'src/services/auth.service';
import { AuthController } from 'src/controllers/auth.controller';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, PrismaService, AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}