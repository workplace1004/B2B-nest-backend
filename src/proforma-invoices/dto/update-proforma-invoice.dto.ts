import { PartialType } from '@nestjs/mapped-types';
import { CreateProformaInvoiceDto } from './create-proforma-invoice.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ProformaInvoiceStatus } from '@prisma/client';

export class UpdateProformaInvoiceDto extends PartialType(CreateProformaInvoiceDto) {
  @IsEnum(ProformaInvoiceStatus)
  @IsOptional()
  status?: ProformaInvoiceStatus;
}

