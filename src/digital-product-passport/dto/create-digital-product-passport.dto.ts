import { IsString, IsNumber, IsOptional, IsArray, IsDateString, IsEnum } from 'class-validator';

export class CreateDigitalProductPassportDto {
  @IsNumber()
  productId: number;

  @IsString()
  @IsOptional()
  passportId?: string;

  @IsString()
  @IsOptional()
  manufacturerName?: string;

  @IsString()
  @IsOptional()
  manufacturerAddress?: string;

  @IsString()
  @IsOptional()
  countryOfOrigin?: string;

  @IsDateString()
  @IsOptional()
  productionDate?: string;

  @IsOptional()
  materials?: Array<{ name: string; percentage: number }>;

  @IsNumber()
  @IsOptional()
  carbonFootprint?: number;

  @IsNumber()
  @IsOptional()
  waterFootprint?: number;

  @IsString()
  @IsOptional()
  recyclability?: string;

  @IsString()
  @IsOptional()
  repairability?: string;

  @IsString()
  @IsOptional()
  careInstructions?: string;

  @IsString()
  @IsOptional()
  disposalInstructions?: string;

  @IsOptional()
  traceabilityData?: any;
}







