import { Module } from '@nestjs/common';
import { PartialShipmentsService } from './partial-shipments.service';
import { PartialShipmentsController } from './partial-shipments.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PartialShipmentsController],
  providers: [PartialShipmentsService],
  exports: [PartialShipmentsService],
})
export class PartialShipmentsModule {}

