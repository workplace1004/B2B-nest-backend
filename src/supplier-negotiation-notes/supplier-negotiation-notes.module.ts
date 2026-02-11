import { Module } from '@nestjs/common';
import { SupplierNegotiationNotesService } from './supplier-negotiation-notes.service';
import { SupplierNegotiationNotesController } from './supplier-negotiation-notes.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SupplierNegotiationNotesController],
  providers: [SupplierNegotiationNotesService],
  exports: [SupplierNegotiationNotesService],
})
export class SupplierNegotiationNotesModule {}

