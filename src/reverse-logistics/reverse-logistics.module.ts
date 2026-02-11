import { Module } from '@nestjs/common';
import { ReverseLogisticsService } from './reverse-logistics.service';
import { ReverseLogisticsController } from './reverse-logistics.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReverseLogisticsController],
  providers: [ReverseLogisticsService],
  exports: [ReverseLogisticsService],
})
export class ReverseLogisticsModule {}

