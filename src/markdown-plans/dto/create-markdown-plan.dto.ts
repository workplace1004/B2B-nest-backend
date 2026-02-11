import { IsInt, IsNumber, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateMarkdownPlanDto {
  @IsInt()
  productId: number;

  @IsNumber()
  discountPercent: number;

  @IsNumber()
  newPrice: number;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

