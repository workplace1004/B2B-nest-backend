import { Module } from '@nestjs/common';
import { StockControlConfigurationsService } from './stock-control-configurations.service';
import { StockControlConfigurationsController } from './stock-control-configurations.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StockControlConfigurationsController],
  providers: [StockControlConfigurationsService],
})
export class StockControlConfigurationsModule {}

