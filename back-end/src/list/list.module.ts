import { Module } from '@nestjs/common';
import { ListService } from '../list/list.service';
import { ListController } from './list.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}
