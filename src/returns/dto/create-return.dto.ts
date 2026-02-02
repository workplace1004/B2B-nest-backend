import { IsString, IsOptional, IsEnum, IsNumber, IsDateString } from 'class-validator';

export enum ReturnStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ReturnReason {
  DEFECTIVE = 'DEFECTIVE',
  WRONG_SIZE = 'WRONG_SIZE',
  NOT_AS_DESCRIBED = 'NOT_AS_DESCRIBED',
  DAMAGED = 'DAMAGED',
  CUSTOMER_REQUEST = 'CUSTOMER_REQUEST',
  OTHER = 'OTHER',
}

export class CreateReturnDto {
  @IsString()
  rmaNumber: string;

  @IsNumber()
  orderId: number;

  @IsNumber()
  productId: number;

  @IsOptional()
  @IsNumber()
  orderLineId?: number;

  @IsNumber()
  quantity: number;

  @IsEnum(ReturnReason)
  reason: ReturnReason;

  @IsOptional()
  @IsString()
  reasonDetails?: string;

  @IsOptional()
  @IsEnum(ReturnStatus)
  status?: ReturnStatus;

  @IsOptional()
  @IsNumber()
  refundAmount?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

