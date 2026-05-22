import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { MarketCurrencySettingsService } from './market-currency-settings.service';
import { CreateMarketCurrencySettingDto } from './dto/create-market-currency-setting.dto';
import { UpdateMarketCurrencySettingDto } from './dto/update-market-currency-setting.dto';
@Controller('market-currency-settings')
export class MarketCurrencySettingsController {
  constructor(private readonly marketCurrencySettingsService: MarketCurrencySettingsService) {}

  @Post()
  create(@Body() createDto: CreateMarketCurrencySettingDto) {
    return this.marketCurrencySettingsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.marketCurrencySettingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marketCurrencySettingsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateMarketCurrencySettingDto) {
    return this.marketCurrencySettingsService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marketCurrencySettingsService.remove(id);
  }
}

