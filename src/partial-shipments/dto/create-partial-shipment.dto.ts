import { IsNotEmpty, IsNumber, IsOptional, IsEnum, IsDateString, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum PartialShipmentStatus {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export class CreatePartialShipmentItemDto {
  @IsNotEmpty()
  @IsNumber()
  orderLineId: number;

  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class CreatePartialShipmentDto {
  @IsNotEmpty()
  @IsNumber()
  orderId: number;

  @IsOptional()
  @IsEnum(PartialShipmentStatus)
  status?: PartialShipmentStatus;

  @IsOptional()
  @IsDateString()
  shippedDate?: string;

  @IsOptional()
  @IsDateString()
  deliveredDate?: string;

  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @IsOptional()
  @IsString()
  carrier?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePartialShipmentItemDto)
  items: CreatePartialShipmentItemDto[];
}

