import { IsString, IsNumber, IsArray, IsBoolean, IsOptional } from 'class-validator';

export class CreateMarketCurrencySettingDto {
  @IsOptional()
  @IsNumber()
  marketId?: number;

  @IsString()
  marketName: string;

  @IsString()
  marketCode: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsString()
  defaultCurrency: string;

  @IsArray()
  @IsString({ each: true })
  supportedCurrencies: string[];

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

