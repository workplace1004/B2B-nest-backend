import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FxRatesService {
  constructor(private prisma: PrismaService) {}

  async findAll(baseCurrency?: string) {
    const where: any = {};
    if (baseCurrency) {
      where.fromCurrency = baseCurrency;
    }

    const rates = await this.prisma.fxRate.findMany({
      where,
      orderBy: { toCurrency: 'asc' },
    });

    // Map Prisma Decimal to number and calculate change if needed
    const mappedRates = rates.map((rate) => ({
      id: rate.id,
      fromCurrency: rate.fromCurrency,
      toCurrency: rate.toCurrency,
      rate: Number(rate.rate),
      previousRate: rate.previousRate ? Number(rate.previousRate) : undefined,
      change: rate.change ? Number(rate.change) : undefined,
      changePercent: rate.changePercent ? Number(rate.changePercent) : undefined,
      source: rate.source,
      lastUpdated: rate.lastUpdated.toISOString(),
    }));

    return {
      data: mappedRates,
    };
  }

  async findOne(id: number) {
    const rate = await this.prisma.fxRate.findUnique({
      where: { id },
    });

    if (!rate) {
      return null;
    }

    return {
      data: {
        id: rate.id,
        fromCurrency: rate.fromCurrency,
        toCurrency: rate.toCurrency,
        rate: Number(rate.rate),
        previousRate: rate.previousRate ? Number(rate.previousRate) : undefined,
        change: rate.change ? Number(rate.change) : undefined,
        changePercent: rate.changePercent ? Number(rate.changePercent) : undefined,
        source: rate.source,
        lastUpdated: rate.lastUpdated.toISOString(),
      },
    };
  }

  async refresh(baseCurrency: string) {
    // Get all rates for the base currency
    const ratesToUpdate = await this.prisma.fxRate.findMany({
      where: { fromCurrency: baseCurrency },
    });

    const updatedRates = [];

    for (const rate of ratesToUpdate) {
      // In a real implementation, you would fetch rates from an external API
      // For now, we'll simulate a small random change
      const currentRate = Number(rate.rate);
      const previousRate = rate.previousRate ? Number(rate.previousRate) : currentRate;
      
      // Simulate a small change (±1%)
      const variation = (Math.random() - 0.5) * 0.02; // ±1%
      const newRate = currentRate * (1 + variation);
      const change = newRate - previousRate;
      const changePercent = previousRate !== 0 ? (change / previousRate) * 100 : 0;

      const updated = await this.prisma.fxRate.update({
        where: { id: rate.id },
        data: {
          previousRate: rate.rate, // Current rate becomes previous
          rate: newRate,
          change: change,
          changePercent: changePercent,
          lastUpdated: new Date(),
        },
      });

      updatedRates.push({
        id: updated.id,
        fromCurrency: updated.fromCurrency,
        toCurrency: updated.toCurrency,
        rate: Number(updated.rate),
        previousRate: updated.previousRate ? Number(updated.previousRate) : undefined,
        change: updated.change ? Number(updated.change) : undefined,
        changePercent: updated.changePercent ? Number(updated.changePercent) : undefined,
        source: updated.source,
        lastUpdated: updated.lastUpdated.toISOString(),
      });
    }

    return {
      data: updatedRates,
      message: `FX rates for ${baseCurrency} have been refreshed`,
    };
  }
}

