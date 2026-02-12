import { IsOptional, IsNumber, IsEnum, IsString, IsDateString } from 'class-validator';
import { CycleCountItemStatus } from '@prisma/client';

export class UpdateCycleCountItemDto {
  @IsOptional()
  @IsNumber()
  countedQuantity?: number;

  @IsOptional()
  @IsEnum(CycleCountItemStatus)
  status?: CycleCountItemStatus;

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

