import { IsString, IsNumber, IsArray, IsBoolean, IsOptional } from 'class-validator';

export class UpdateMarketCurrencySettingDto {
  @IsOptional()
  @IsNumber()
  marketId?: number;

  @IsOptional()
  @IsString()
  marketName?: string;

  @IsOptional()
  @IsString()
  marketCode?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  defaultCurrency?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supportedCurrencies?: string[];

  @IsOptional()
  @IsBoolean()
  autoUpdateRates?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  roundingPrecision?: number;
}

