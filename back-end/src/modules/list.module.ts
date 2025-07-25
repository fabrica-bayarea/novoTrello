import { Module } from '@nestjs/common';
import { ListService } from '../services/list.service';
import { ListController } from '../controllers/list.controller';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}
