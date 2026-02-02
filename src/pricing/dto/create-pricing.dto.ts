import { IsNumber, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreatePricingDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  basePrice: number;

  @IsOptional()
  @IsNumber()
  discountPercent?: number;

  @IsNumber()
  finalPrice: number;

  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

