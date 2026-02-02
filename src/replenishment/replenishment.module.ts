import { Module } from '@nestjs/common';
import { ReplenishmentService } from './replenishment.service';
import { ReplenishmentController } from './replenishment.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReplenishmentController],
  providers: [ReplenishmentService],
  exports: [ReplenishmentService],
})
export class ReplenishmentModule {}

