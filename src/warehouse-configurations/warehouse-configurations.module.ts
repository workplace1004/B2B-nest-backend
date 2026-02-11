import { Module } from '@nestjs/common';
import { WarehouseConfigurationsService } from './warehouse-configurations.service';
import { WarehouseConfigurationsController } from './warehouse-configurations.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WarehouseConfigurationsController],
  providers: [WarehouseConfigurationsService],
})
export class WarehouseConfigurationsModule {}

