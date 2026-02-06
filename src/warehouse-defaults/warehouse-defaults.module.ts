import { Module } from '@nestjs/common';
import { WarehouseDefaultsService } from './warehouse-defaults.service';
import { WarehouseDefaultsController } from './warehouse-defaults.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WarehouseDefaultsController],
  providers: [WarehouseDefaultsService],
  exports: [WarehouseDefaultsService],
})
export class WarehouseDefaultsModule {}

