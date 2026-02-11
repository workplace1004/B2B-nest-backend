import { Module } from '@nestjs/common';
import { PreOrdersService } from './pre-orders.service';
import { PreOrdersController } from './pre-orders.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PreOrdersController],
  providers: [PreOrdersService],
  exports: [PreOrdersService],
})
export class PreOrdersModule {}

