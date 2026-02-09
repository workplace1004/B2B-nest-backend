import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMarketCurrencySettingDto } from './dto/create-market-currency-setting.dto';
import { UpdateMarketCurrencySettingDto } from './dto/update-market-currency-setting.dto';

@Injectable()
export class MarketCurrencySettingsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateMarketCurrencySettingDto) {
    const setting = await this.prisma.marketCurrencySetting.create({
      data: {
        marketId: createDto.marketId ? (typeof createDto.marketId === 'string' ? parseInt(createDto.marketId) : createDto.marketId) : undefined,
        marketName: createDto.marketName,
        marketCode: createDto.marketCode,
        region: createDto.region,
        defaultCurrency: createDto.defaultCurrency,
        supportedCurrencies: createDto.supportedCurrencies,
        autoUpdateRates: createDto.autoUpdateRates ?? true,
        isActive: createDto.isActive ?? true,
        roundingPrecision: createDto.roundingPrecision ?? 2,
      },
    });

    return { data: this.mapSetting(setting) };
  }

  async findAll() {
    const settings = await this.prisma.marketCurrencySetting.findMany({
      orderBy: { marketName: 'asc' },
    });

    return {
      data: settings.map((s) => this.mapSetting(s)),
    };
  }

  async findOne(id: string) {
    const setting = await this.prisma.marketCurrencySetting.findUnique({
      where: { id: parseInt(id) },
    });

    if (!setting) {
      throw new NotFoundException(`Market currency setting with ID ${id} not found`);
    }

    return { data: this.mapSetting(setting) };
  }

  async update(id: string, updateDto: UpdateMarketCurrencySettingDto) {
    try {
      // Build update data object, only including defined fields
      const updateData: any = {};
      
      if (updateDto.marketId !== undefined) {
        updateData.marketId = typeof updateDto.marketId === 'string' ? parseInt(updateDto.marketId) : updateDto.marketId;
      }
      if (updateDto.marketName !== undefined) updateData.marketName = updateDto.marketName;
      if (updateDto.marketCode !== undefined) updateData.marketCode = updateDto.marketCode;
      if (updateDto.region !== undefined) updateData.region = updateDto.region;
      if (updateDto.defaultCurrency !== undefined) updateData.defaultCurrency = updateDto.defaultCurrency;
      if (updateDto.supportedCurrencies !== undefined) updateData.supportedCurrencies = updateDto.supportedCurrencies;
      if (updateDto.autoUpdateRates !== undefined) updateData.autoUpdateRates = updateDto.autoUpdateRates;
      if (updateDto.isActive !== undefined) updateData.isActive = updateDto.isActive;
      if (updateDto.roundingPrecision !== undefined) updateData.roundingPrecision = updateDto.roundingPrecision;

      const setting = await this.prisma.marketCurrencySetting.update({
        where: { id: parseInt(id) },
        data: updateData,
      });

      return { data: this.mapSetting(setting) };
    } catch (error) {
      throw new NotFoundException(`Market currency setting with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      const setting = await this.prisma.marketCurrencySetting.delete({
        where: { id: parseInt(id) },
      });

      return { data: this.mapSetting(setting) };
    } catch (error) {
      throw new NotFoundException(`Market currency setting with ID ${id} not found`);
    }
  }

  private mapSetting(setting: any) {
    return {
      id: setting.id.toString(),
      marketId: setting.marketId?.toString(),
      marketName: setting.marketName,
      marketCode: setting.marketCode,
      region: setting.region,
      defaultCurrency: setting.defaultCurrency,
      supportedCurrencies: setting.supportedCurrencies,
      autoUpdateRates: setting.autoUpdateRates,
      isActive: setting.isActive,
      roundingPrecision: setting.roundingPrecision,
      createdAt: setting.createdAt.toISOString(),
      updatedAt: setting.updatedAt.toISOString(),
    };
  }
}

