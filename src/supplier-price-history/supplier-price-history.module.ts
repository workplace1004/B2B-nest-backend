import { Module } from '@nestjs/common';
import { SupplierPriceHistoryService } from './supplier-price-history.service';
import { SupplierPriceHistoryController } from './supplier-price-history.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SupplierPriceHistoryController],
  providers: [SupplierPriceHistoryService],
  exports: [SupplierPriceHistoryService],
})
export class SupplierPriceHistoryModule {}

