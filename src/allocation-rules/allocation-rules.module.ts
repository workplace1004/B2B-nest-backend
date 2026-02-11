import { Module } from '@nestjs/common';
import { AllocationRulesService } from './allocation-rules.service';
import { AllocationRulesController } from './allocation-rules.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AllocationRulesController],
  providers: [AllocationRulesService],
  exports: [AllocationRulesService],
})
export class AllocationRulesModule {}

