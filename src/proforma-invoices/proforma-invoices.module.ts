import { Module } from '@nestjs/common';
import { ProformaInvoicesService } from './proforma-invoices.service';
import { ProformaInvoicesController } from './proforma-invoices.controller';

@Module({
  controllers: [ProformaInvoicesController],
  providers: [ProformaInvoicesService],
  exports: [ProformaInvoicesService],
})
export class ProformaInvoicesModule {}

