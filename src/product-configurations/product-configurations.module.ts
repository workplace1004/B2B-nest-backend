import { Module } from '@nestjs/common';
import { ProductConfigurationsService } from './product-configurations.service';
import { ProductConfigurationsController } from './product-configurations.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductConfigurationsController],
  providers: [ProductConfigurationsService],
})
export class ProductConfigurationsModule {}

