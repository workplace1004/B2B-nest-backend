import { IsInt, IsString, IsOptional, IsEnum, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export enum PickListStatus {
  DRAFT = 'DRAFT',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum PickItemStatus {
  PENDING = 'PENDING',
  PICKED = 'PICKED',
  PARTIAL = 'PARTIAL',
  SKIPPED = 'SKIPPED',
}

export class CreatePickListItemDto {
  @IsInt()
  orderLineId: number;

  @IsInt()
  productId: number;

  @IsOptional()
  @IsString()
  binLocation?: string;

  @IsInt()
  quantity: number;

  @IsOptional()
  @IsInt()
  pickedQuantity?: number;

  @IsOptional()
  @IsEnum(PickItemStatus)
  status?: PickItemStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreatePickListDto {
  @IsInt()
  orderId: number;

  @IsInt()
  warehouseId: number;

  @IsOptional()
  @IsEnum(PickListStatus)
  status?: PickListStatus;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsDateString()
  startedAt?: string;

  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePickListItemDto)
  items: CreatePickListItemDto[];
}

