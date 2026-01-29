import { IsNumber, IsOptional, Min } from 'class-validator';

export class CreateInventoryDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  warehouseId: number;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  reservedQty?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  reorderPoint?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  safetyStock?: number;
}

