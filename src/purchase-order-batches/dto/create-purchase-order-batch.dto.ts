import { IsInt, IsString, IsOptional, IsEnum, IsDateString, Min } from 'class-validator';

export enum BatchStatus {
  PENDING = 'PENDING',
  IN_PRODUCTION = 'IN_PRODUCTION',
  COMPLETED = 'COMPLETED',
  QUARANTINED = 'QUARANTINED',
}

export class CreatePurchaseOrderBatchDto {
  @IsInt()
  purchaseOrderId: number;

  @IsString()
  batchNumber: string;

  @IsOptional()
  @IsString()
  lotNumber?: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsDateString()
  productionDate?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsEnum(BatchStatus)
  status: BatchStatus;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

