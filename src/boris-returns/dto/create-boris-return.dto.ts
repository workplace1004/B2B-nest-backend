import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum BORISReturnStatus {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  RECEIVED = 'RECEIVED',
  PROCESSED = 'PROCESSED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export enum ItemCondition {
  NEW = 'NEW',
  USED = 'USED',
  DAMAGED = 'DAMAGED',
  DEFECTIVE = 'DEFECTIVE',
}

export class CreateBORISReturnItemDto {
  @IsNumber()
  orderLineId: number;

  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;

  @IsEnum(ItemCondition)
  condition: ItemCondition;

  @IsNumber()
  refundAmount: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateBORISReturnDto {
  @IsNumber()
  returnId: number;

  @IsString()
  returnNumber: string;

  @IsNumber()
  orderId: number;

  @IsNumber()
  customerId: number;

  @IsNumber()
  storeId: number;

  @IsOptional()
  @IsEnum(BORISReturnStatus)
  status?: BORISReturnStatus;

  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @IsOptional()
  @IsDateString()
  receivedDate?: string;

  @IsOptional()
  @IsDateString()
  processedDate?: string;

  @IsString()
  reason: string;

  @IsOptional()
  @IsNumber()
  refundAmount?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBORISReturnItemDto)
  items: CreateBORISReturnItemDto[];
}

