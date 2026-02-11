import { IsString, IsEnum, IsOptional, IsInt } from 'class-validator';
import { ServiceCaseStatus, ServiceCasePriority } from '@prisma/client';

export class CreateServiceCaseDto {
  @IsString()
  caseNumber: string;

  @IsInt()
  @IsOptional()
  customerId?: number;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(ServiceCaseStatus)
  @IsOptional()
  status?: ServiceCaseStatus;

  @IsEnum(ServiceCasePriority)
  @IsOptional()
  priority?: ServiceCasePriority;

  @IsString()
  @IsOptional()
  assignedTo?: string;

  @IsString()
  @IsOptional()
  resolution?: string;
}

