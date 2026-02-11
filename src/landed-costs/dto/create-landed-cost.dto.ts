import { IsInt, IsNumber, IsString, IsOptional, IsDateString, Min } from 'class-validator';

export class CreateLandedCostDto {
  @IsInt()
  orderId: number;

  // Product Costs
  @IsNumber()
  @Min(0)
  productCost: number; // FOB cost

  // Shipping & Logistics
  @IsNumber()
  @Min(0)
  shippingCost: number;

  @IsNumber()
  @Min(0)
  freightCost: number;

  @IsNumber()
  @Min(0)
  insuranceCost: number;

  // Customs & Duties
  @IsNumber()
  @Min(0)
  customsDuty: number;

  @IsOptional()
  @IsNumber()
  customsDutyRate?: number; // Percentage

  @IsNumber()
  @Min(0)
  tariffs: number;

  // Port & Handling
  @IsNumber()
  @Min(0)
  portFees: number;

  @IsNumber()
  @Min(0)
  handlingFees: number;

  // Other Costs
  @IsNumber()
  @Min(0)
  otherCosts: number;

  @IsOptional()
  @IsString()
  otherCostsDescription?: string;

  // Totals
  @IsNumber()
  @Min(0)
  subtotal: number; // Sum of all costs

  @IsNumber()
  @Min(0)
  totalLandedCost: number; // Final landed cost

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsDateString()
  calculatedDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

