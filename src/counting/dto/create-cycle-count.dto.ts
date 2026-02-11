import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum CycleCountType {
  ABC = 'ABC',
  FULL = 'FULL',
  RANDOM = 'RANDOM',
  LOCATION_BASED = 'LOCATION_BASED',
}

export enum CycleCountStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreateCycleCountItemDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  binLocation?: string;

  @IsNotEmpty()
  @IsNumber()
  systemQuantity: number;

  @IsOptional()
  @IsNumber()
  countedQuantity?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateCycleCountDto {
  @IsNotEmpty()
  @IsNumber()
  warehouseId: number;

  @IsNotEmpty()
  @IsEnum(CycleCountType)
  countType: CycleCountType;

  @IsNotEmpty()
  @IsDateString()
  scheduledDate: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCycleCountItemDto)
  items?: CreateCycleCountItemDto[];
}

