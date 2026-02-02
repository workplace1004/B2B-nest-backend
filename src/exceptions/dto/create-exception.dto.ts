import { IsString, IsOptional, IsEnum, IsNumber, IsObject } from 'class-validator';

export enum ExceptionType {
  INVENTORY_MISMATCH = 'INVENTORY_MISMATCH',
  ORDER_PROCESSING_DELAY = 'ORDER_PROCESSING_DELAY',
  SHIPMENT_DELAY = 'SHIPMENT_DELAY',
  PAYMENT_FAILURE = 'PAYMENT_FAILURE',
  DATA_INCONSISTENCY = 'DATA_INCONSISTENCY',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  CUSTOM = 'CUSTOM',
}

export enum ExceptionStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export class CreateExceptionDto {
  @IsEnum(ExceptionType)
  type: ExceptionType;

  @IsOptional()
  @IsEnum(ExceptionStatus)
  status?: ExceptionStatus;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  entityType?: string;

  @IsOptional()
  @IsNumber()
  entityId?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

