import { IsInt, IsString, IsOptional, IsEnum, IsDateString, Min } from 'class-validator';

export enum PurchaseOrderApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class CreatePurchaseOrderApprovalDto {
  @IsInt()
  purchaseOrderId: number;

  @IsOptional()
  @IsInt()
  approverId?: number;

  @IsString()
  approverName: string;

  @IsEnum(PurchaseOrderApprovalStatus)
  status: PurchaseOrderApprovalStatus;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsInt()
  @Min(1)
  level: number;
}

