import { IsNotEmpty, IsNumber, IsOptional, IsEnum, IsString } from 'class-validator';

export enum BackorderStatus {
  PENDING = 'PENDING',
  ALLOCATED = 'ALLOCATED',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED',
}

export class CreateBackorderDto {
  @IsNotEmpty()
  @IsNumber()
  orderId: number;

  @IsNotEmpty()
  @IsNumber()
  orderLineId: number;

  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsEnum(BackorderStatus)
  status?: BackorderStatus;

  @IsOptional()
  @IsNumber()
  allocatedQty?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

