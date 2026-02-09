export class CreateMarketCurrencySettingDto {
  marketId?: number;
  marketName: string;
  marketCode: string;
  region?: string;
  defaultCurrency: string;
  supportedCurrencies: string[];
  autoUpdateRates?: boolean;
  isActive?: boolean;
  roundingPrecision?: number;
}

