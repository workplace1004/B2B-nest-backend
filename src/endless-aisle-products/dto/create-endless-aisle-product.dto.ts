import { IsNumber, IsOptional, IsBoolean, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEndlessAisleWarehouseDto {
  @IsNumber()
  warehouseId: number;

  @IsNumber()
  availableQuantity: number;

  @IsOptional()
  @IsNumber()
  estimatedShippingDays?: number;
}

export class CreateEndlessAisleProductDto {
  @IsNumber()
  productId: number;

  @IsOptional()
  @IsNumber()
  basePrice?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsNumber()
  estimatedShippingDays?: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  collection?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEndlessAisleWarehouseDto)
  availableAtWarehouses: CreateEndlessAisleWarehouseDto[];
}

