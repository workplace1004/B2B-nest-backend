import { IsInt, IsNumber, IsString, IsOptional, IsDateString, Min } from 'class-validator';

export class CreateSupplierPriceHistoryDto {
  @IsInt()
  supplierId: number;

  @IsOptional()
  @IsInt()
  productId?: number;

  @IsOptional()
  @IsString()
  productName?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  createdBy?: string;
}

