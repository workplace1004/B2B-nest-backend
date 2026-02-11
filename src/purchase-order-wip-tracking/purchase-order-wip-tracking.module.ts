import { Module } from '@nestjs/common';
import { PurchaseOrderWIPTrackingService } from './purchase-order-wip-tracking.service';
import { PurchaseOrderWIPTrackingController } from './purchase-order-wip-tracking.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PurchaseOrderWIPTrackingController],
  providers: [PurchaseOrderWIPTrackingService],
  exports: [PurchaseOrderWIPTrackingService],
})
export class PurchaseOrderWIPTrackingModule {}

