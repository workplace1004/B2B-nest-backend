import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum PhysicalInventoryStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreatePhysicalInventoryItemDto {
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

export class CreatePhysicalInventoryDto {
  @IsNotEmpty()
  @IsNumber()
  warehouseId: number;

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
  @Type(() => CreatePhysicalInventoryItemDto)
  items?: CreatePhysicalInventoryItemDto[];
}

