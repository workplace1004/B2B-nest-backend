import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean } from 'class-validator';
import { TaxType } from '@prisma/client';

export class CreateTaxDefaultDto {
  @IsString()
  name: string;

  @IsEnum(TaxType)
  type: TaxType;

  @IsNumber()
  rate: number;

  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}

