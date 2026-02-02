import { IsString, IsOptional, IsEnum, IsNumber, IsObject, IsDateString } from 'class-validator';

export enum AlertType {
  LOW_STOCK = 'LOW_STOCK',
  HIGH_STOCK = 'HIGH_STOCK',
  ORDER_DELAY = 'ORDER_DELAY',
  PAYMENT_ISSUE = 'PAYMENT_ISSUE',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  CUSTOM = 'CUSTOM',
}

export enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum AlertStatus {
  NEW = 'NEW',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
}

export class CreateAlertDto {
  @IsEnum(AlertType)
  type: AlertType;

  @IsEnum(AlertSeverity)
  severity: AlertSeverity;

  @IsOptional()
  @IsEnum(AlertStatus)
  status?: AlertStatus;

  @IsString()
  title: string;

  @IsString()
  message: string;

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

