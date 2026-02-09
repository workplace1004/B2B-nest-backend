import { IsNumber, IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ShipmentStatus } from '@prisma/client';

export class CreateShipmentDto {
  @IsNumber()
  orderId: number;

  @IsNumber()
  warehouseId: number;

  @IsEnum(ShipmentStatus)
  @IsOptional()
  status?: ShipmentStatus;

  @IsString()
  @IsOptional()
  carrier?: string;

  @IsString()
  @IsOptional()
  trackingNumber?: string;

  @IsNumber()
  @IsOptional()
  shippingCost?: number;

  @IsDateString()
  @IsOptional()
  shippedDate?: Date;

  @IsDateString()
  @IsOptional()
  deliveredDate?: Date;
}

