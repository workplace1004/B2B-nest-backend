import { IsString, IsOptional, IsInt, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { CommissionType, CommissionStatus } from '@prisma/client';

export class CreateSalesRepCommissionDto {
  @IsInt()
  userId: number;

  @IsString()
  period: string; // e.g., "2024-01", "2024-Q1"

  @IsEnum(CommissionType)
  @IsOptional()
  type?: CommissionType;

  @IsNumber()
  @IsOptional()
  salesAmount?: number;

  @IsNumber()
  @IsOptional()
  marginAmount?: number;

  @IsNumber()
  @IsOptional()
  commissionRate?: number;

  @IsNumber()
  @IsOptional()
  commissionAmount?: number;

  @IsEnum(CommissionStatus)
  @IsOptional()
  status?: CommissionStatus;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDateString()
  @IsOptional()
  calculatedAt?: string;

  @IsDateString()
  @IsOptional()
  approvedAt?: string;

  @IsDateString()
  @IsOptional()
  paidAt?: string;
}

