import { Module } from '@nestjs/common';
import { CostSheetsController } from './cost-sheets.controller';
import { CostSheetsService } from './cost-sheets.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CostSheetsController],
  providers: [CostSheetsService],
  exports: [CostSheetsService],
})
export class CostSheetsModule {}

