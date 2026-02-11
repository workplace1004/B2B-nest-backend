import { Module } from '@nestjs/common';
import { ScanHistoryService } from './scan-history.service';
import { ScanHistoryController } from './scan-history.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ScanHistoryController],
  providers: [ScanHistoryService],
  exports: [ScanHistoryService],
})
export class ScanHistoryModule {}

