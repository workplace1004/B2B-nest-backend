import { Module } from '@nestjs/common';
import { LandedCostsService } from './landed-costs.service';
import { LandedCostsController } from './landed-costs.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LandedCostsController],
  providers: [LandedCostsService],
  exports: [LandedCostsService],
})
export class LandedCostsModule {}

