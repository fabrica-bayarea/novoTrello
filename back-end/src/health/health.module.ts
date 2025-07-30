import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [HealthController],
  providers: [HealthService, PrismaService],
})
export class HealthModule {}
