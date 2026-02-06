import { IsString, IsOptional, IsArray, IsEnum, IsNumber } from 'class-validator';
import { BrandStatus } from '@prisma/client';

export class CreateBrandDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsEnum(BrandStatus)
  status?: BrandStatus;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  marketIds?: number[];
}

