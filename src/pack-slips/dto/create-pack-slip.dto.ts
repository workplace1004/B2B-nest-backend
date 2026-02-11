import { IsInt, IsString, IsOptional, IsEnum, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export enum PackSlipStatus {
  DRAFT = 'DRAFT',
  PACKING = 'PACKING',
  PACKED = 'PACKED',
  SHIPPED = 'SHIPPED',
  CANCELLED = 'CANCELLED',
}

export class CreatePackSlipItemDto {
  @IsInt()
  orderLineId: number;

  @IsInt()
  productId: number;

  @IsInt()
  quantity: number;

  @IsOptional()
  @IsInt()
  packedQty?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreatePackSlipDto {
  @IsInt()
  orderId: number;

  @IsOptional()
  @IsString()
  pickListId?: string;

  @IsInt()
  warehouseId: number;

  @IsOptional()
  @IsEnum(PackSlipStatus)
  status?: PackSlipStatus;

  @IsOptional()
  @IsString()
  packedBy?: string;

  @IsOptional()
  @IsDateString()
  packedAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePackSlipItemDto)
  items: CreatePackSlipItemDto[];
}

