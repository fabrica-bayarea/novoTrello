import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { AuthModule } from 'src/modules/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from 'src/controllers/auth.controller';
import { AuthService } from 'src/services/auth.service';
import { PrismaModule } from 'src/modules/prisma.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, ConfigModule, PrismaModule],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, JwtService],
})
export class AppModule {}
