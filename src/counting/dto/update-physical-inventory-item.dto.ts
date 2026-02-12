import { IsOptional, IsNumber, IsEnum, IsString, IsDateString } from 'class-validator';
import { PhysicalInventoryItemStatus } from '@prisma/client';

export class UpdatePhysicalInventoryItemDto {
  @IsOptional()
  @IsNumber()
  countedQuantity?: number;

  @IsOptional()
  @IsEnum(PhysicalInventoryItemStatus)
  status?: PhysicalInventoryItemStatus;

  @IsOptional()
  @IsString()
  countedBy?: string;

  @IsOptional()
  @IsDateString()
  countedAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

