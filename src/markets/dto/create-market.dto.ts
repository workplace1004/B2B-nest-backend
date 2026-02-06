import { IsString, IsOptional, IsArray, IsEnum, IsNumber } from 'class-validator';
import { MarketStatus } from '@prisma/client';

export class CreateMarketDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsString()
  country: string;

  @IsString()
  currency: string;

  @IsString()
  language: string;

  @IsString()
  timezone: string;

  @IsOptional()
  @IsEnum(MarketStatus)
  status?: MarketStatus;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  brandIds?: number[];
}

