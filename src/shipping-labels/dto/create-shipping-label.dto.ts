import { IsInt, IsString, IsOptional, IsEnum, IsNumber, IsDateString } from 'class-validator';

export enum ShippingLabelStatus {
  PENDING = 'PENDING',
  PRINTED = 'PRINTED',
  SHIPPED = 'SHIPPED',
  CANCELLED = 'CANCELLED',
}

export class CreateShippingLabelDto {
  @IsInt()
  orderId: number;

  @IsOptional()
  @IsString()
  packSlipId?: string;

  @IsString()
  carrier: string;

  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @IsOptional()
  @IsString()
  serviceType?: string;

  @IsOptional()
  @IsEnum(ShippingLabelStatus)
  status?: ShippingLabelStatus;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsString()
  dimensions?: string;

  @IsOptional()
  @IsNumber()
  cost?: number;

  @IsOptional()
  @IsDateString()
  printedAt?: string;

  @IsOptional()
  @IsDateString()
  shippedAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

