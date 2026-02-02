import { IsNumber, IsOptional, IsEnum, IsString } from 'class-validator';

export enum ReplenishmentStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreateReplenishmentDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  warehouseId: number;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsEnum(ReplenishmentStatus)
  status?: ReplenishmentStatus;

  @IsNumber()
  reorderPoint: number;

  @IsNumber()
  safetyStock: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

