import { Module } from '@nestjs/common';
import { EndlessAisleProductsService } from './endless-aisle-products.service';
import { EndlessAisleProductsController } from './endless-aisle-products.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EndlessAisleProductsController],
  providers: [EndlessAisleProductsService],
  exports: [EndlessAisleProductsService],
})
export class EndlessAisleProductsModule {}

