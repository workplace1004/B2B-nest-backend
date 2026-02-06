import { IsNumber, IsString, IsEnum, IsOptional, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ProformaInvoiceStatus } from '@prisma/client';

class ProformaInvoiceLineDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;

  @IsString()
  @IsOptional()
  size?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateProformaInvoiceDto {
  @IsNumber()
  customerId: number;

  @IsNumber()
  @IsOptional()
  quoteId?: number;

  @IsNumber()
  @IsOptional()
  orderId?: number;

  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsEnum(ProformaInvoiceStatus)
  @IsOptional()
  status?: ProformaInvoiceStatus;

  @IsNumber()
  @IsOptional()
  subtotal?: number;

  @IsNumber()
  @IsOptional()
  taxRate?: number;

  @IsNumber()
  @IsOptional()
  taxAmount?: number;

  @IsNumber()
  @IsOptional()
  discountPercent?: number;

  @IsNumber()
  @IsOptional()
  discountAmount?: number;

  @IsNumber()
  @IsOptional()
  totalAmount?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  terms?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProformaInvoiceLineDto)
  @IsOptional()
  invoiceLines?: ProformaInvoiceLineDto[];
}

