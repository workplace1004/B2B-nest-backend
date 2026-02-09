import { Module } from '@nestjs/common';
import { MarketCurrencySettingsService } from './market-currency-settings.service';
import { MarketCurrencySettingsController } from './market-currency-settings.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MarketCurrencySettingsController],
  providers: [MarketCurrencySettingsService],
  exports: [MarketCurrencySettingsService],
})
export class MarketCurrencySettingsModule {}

