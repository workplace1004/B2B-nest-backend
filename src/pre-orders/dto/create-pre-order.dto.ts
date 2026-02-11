import { IsNotEmpty, IsNumber, IsOptional, IsEnum, IsDateString, IsString } from 'class-validator';

export enum PreOrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED',
}

export class CreatePreOrderDto {
  @IsNotEmpty()
  @IsNumber()
  orderId: number;

  @IsOptional()
  @IsNumber()
  orderLineId?: number;

  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsDateString()
  expectedDate?: string;

  @IsOptional()
  @IsEnum(PreOrderStatus)
  status?: PreOrderStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

