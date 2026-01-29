import { IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class CreateForecastDto {
  @IsNumber()
  productId: number;

  @IsString()
  @IsOptional()
  size?: string;

  @IsString()
  period: string;

  @IsNumber()
  @Min(0)
  predictedDemand: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  confidence?: number;

  @IsString()
  @IsOptional()
  method?: string;
}

