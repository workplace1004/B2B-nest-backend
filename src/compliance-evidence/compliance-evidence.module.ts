import { Module } from '@nestjs/common';
import { ComplianceEvidenceService } from './compliance-evidence.service';
import { ComplianceEvidenceController } from './compliance-evidence.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ComplianceEvidenceController],
  providers: [ComplianceEvidenceService],
  exports: [ComplianceEvidenceService],
})
export class ComplianceEvidenceModule {}






