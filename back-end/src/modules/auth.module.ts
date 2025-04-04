import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { PrismaService } from 'src/services/prisma.service';
import { AuthService } from 'src/services/auth.service';
import { AuthController } from 'src/controllers/auth.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(),JwtModule.register({})],
  controllers: [AuthController],
  providers: [JwtStrategy, PrismaService, AuthService],
})
export class AuthModule {}