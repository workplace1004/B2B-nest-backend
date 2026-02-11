import { Module } from '@nestjs/common';
import { PurchaseOrderApprovalsService } from './purchase-order-approvals.service';
import { PurchaseOrderApprovalsController } from './purchase-order-approvals.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PurchaseOrderApprovalsController],
  providers: [PurchaseOrderApprovalsService],
  exports: [PurchaseOrderApprovalsService],
})
export class PurchaseOrderApprovalsModule {}

