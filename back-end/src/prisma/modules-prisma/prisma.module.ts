import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
  providers: [PrismaService],
  exports: [PrismaService], // Isso garante que o PrismaService seja acessível fora deste módulo
})
export class PrismaModule {}