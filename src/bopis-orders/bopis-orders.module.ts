import { Module } from '@nestjs/common';
import { BOPISOrdersService } from './bopis-orders.service';
import { BOPISOrdersController } from './bopis-orders.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BOPISOrdersController],
  providers: [BOPISOrdersService],
  exports: [BOPISOrdersService],
})
export class BOPISOrdersModule {}

