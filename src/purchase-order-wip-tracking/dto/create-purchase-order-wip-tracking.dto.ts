import { IsInt, IsString, IsOptional, IsEnum, IsDateString, Min } from 'class-validator';

export enum WIPTrackingStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
}

export class CreatePurchaseOrderWIPTrackingDto {
  @IsInt()
  purchaseOrderId: number;

  @IsString()
  stage: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  completedQty?: number;

  @IsEnum(WIPTrackingStatus)
  status: WIPTrackingStatus;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  completionDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

