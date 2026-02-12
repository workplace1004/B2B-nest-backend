import { IsNumber, IsString, IsEnum, IsOptional, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PurchaseOrderStatus } from '@prisma/client';

class PurchaseOrderLineDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitCost: number;

  @IsNumber()
  @IsOptional()
  totalCost?: number;
}

export class CreatePurchaseOrderDto {
  @IsNumber()
  supplierId: number;

  @IsNumber()
  @IsOptional()
  bOMId?: number;

  @IsEnum(PurchaseOrderStatus)
  @IsOptional()
  status?: PurchaseOrderStatus;

  @IsNumber()
  @IsOptional()
  totalAmount?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsDateString()
  @IsOptional()
  orderDate?: Date;

  @IsDateString()
  @IsOptional()
  expectedDate?: Date;

  @IsDateString()
  @IsOptional()
  receivedDate?: Date;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseOrderLineDto)
  @IsOptional()
  lines?: PurchaseOrderLineDto[];
}

