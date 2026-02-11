import { Module } from '@nestjs/common';
import { PurchaseOrderBatchesService } from './purchase-order-batches.service';
import { PurchaseOrderBatchesController } from './purchase-order-batches.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PurchaseOrderBatchesController],
  providers: [PurchaseOrderBatchesService],
  exports: [PurchaseOrderBatchesService],
})
export class PurchaseOrderBatchesModule {}

