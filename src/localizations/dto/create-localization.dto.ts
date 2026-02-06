import { IsInt, IsString, IsOptional, IsEnum } from 'class-validator';
import { SizeSystem } from '@prisma/client';

export class CreateLocalizationDto {
  @IsInt()
  marketId: number;

  @IsString()
  language: string;

  @IsString()
  currency: string;

  @IsOptional()
  @IsString()
  dateFormat?: string;

  @IsOptional()
  @IsString()
  timeFormat?: string;

  @IsOptional()
  @IsString()
  numberFormat?: string;

  @IsOptional()
  @IsEnum(SizeSystem)
  sizeSystem?: SizeSystem;

  @IsOptional()
  @IsString()
  weightUnit?: string;

  @IsOptional()
  @IsString()
  lengthUnit?: string;
}

