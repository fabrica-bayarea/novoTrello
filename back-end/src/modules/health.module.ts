import { Module } from '@nestjs/common';
import { HealthController } from '../controllers/health.controller';
import { HealthService } from '../services/health.service';
import { PrismaService } from '../services/prisma.service';

@Module({
  imports: [],
  controllers: [HealthController],
  providers: [HealthService, PrismaService],
})
export class HealthModule {}