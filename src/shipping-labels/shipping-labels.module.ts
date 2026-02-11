import { Module } from '@nestjs/common';
import { ShippingLabelsService } from './shipping-labels.service';
import { ShippingLabelsController } from './shipping-labels.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ShippingLabelsController],
  providers: [ShippingLabelsService],
  exports: [ShippingLabelsService],
})
export class ShippingLabelsModule {}

