import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocalizationDto } from './dto/create-localization.dto';
import { UpdateLocalizationDto } from './dto/update-localization.dto';

@Injectable()
export class LocalizationsService {
  constructor(private prisma: PrismaService) {}

  async create(createLocalizationDto: CreateLocalizationDto) {
    // Check if market exists
    const market = await this.prisma.market.findUnique({
      where: { id: createLocalizationDto.marketId },
    });

    if (!market) {
      throw new NotFoundException(`Market with ID ${createLocalizationDto.marketId} not found`);
    }

    // Check if localization already exists for this market
    const existing = await this.prisma.localization.findUnique({
      where: { marketId: createLocalizationDto.marketId },
    });

    if (existing) {
      throw new BadRequestException('Localization already exists for this market');
    }

    // Create localization
    const localization = await this.prisma.localization.create({
      data: createLocalizationDto,
      include: {
        market: true,
      },
    });

    return this.mapLocalization(localization);
  }

  async findAll(skip?: number, take?: number) {
    const [data, total] = await Promise.all([
      this.prisma.localization.findMany({
        skip: skip,
        take: take,
        orderBy: { createdAt: 'desc' },
        include: {
          market: true,
        },
      }),
      this.prisma.localization.count(),
    ]);

    const localizations = data.map((loc) => this.mapLocalization(loc));

    return {
      data: localizations,
      total,
      skip: skip || 0,
      take: take || localizations.length,
    };
  }

  async findOne(id: number) {
    const localization = await this.prisma.localization.findUnique({
      where: { id },
      include: {
        market: true,
      },
    });

    if (!localization) {
      throw new NotFoundException(`Localization with ID ${id} not found`);
    }

    return this.mapLocalization(localization);
  }

  async findByMarketId(marketId: number) {
    const localization = await this.prisma.localization.findUnique({
      where: { marketId },
      include: {
        market: true,
      },
    });

    if (!localization) {
      throw new NotFoundException(`Localization for market ID ${marketId} not found`);
    }

    return this.mapLocalization(localization);
  }

  async update(id: number, updateLocalizationDto: UpdateLocalizationDto) {
    const localization = await this.findOne(id);

    // If marketId is being updated, check if new market exists
    if (updateLocalizationDto.marketId && updateLocalizationDto.marketId !== localization.marketId) {
      const market = await this.prisma.market.findUnique({
        where: { id: updateLocalizationDto.marketId },
      });

      if (!market) {
        throw new NotFoundException(`Market with ID ${updateLocalizationDto.marketId} not found`);
      }

      // Check if localization already exists for the new market
      const existing = await this.prisma.localization.findUnique({
        where: { marketId: updateLocalizationDto.marketId },
      });

      if (existing && existing.id !== id) {
        throw new BadRequestException('Localization already exists for this market');
      }
    }

    // Update localization
    const updated = await this.prisma.localization.update({
      where: { id },
      data: updateLocalizationDto,
      include: {
        market: true,
      },
    });

    return this.mapLocalization(updated);
  }

  async remove(id: number) {
    const localization = await this.findOne(id);
    
    await this.prisma.localization.delete({
      where: { id },
    });

    return localization;
  }

  private mapLocalization(localization: any) {
    return {
      id: localization.id,
      marketId: localization.marketId,
      marketName: localization.market?.name || 'Unknown Market',
      language: localization.language,
      currency: localization.currency,
      dateFormat: localization.dateFormat,
      timeFormat: localization.timeFormat,
      numberFormat: localization.numberFormat,
      sizeSystem: localization.sizeSystem,
      weightUnit: localization.weightUnit,
      lengthUnit: localization.lengthUnit,
      createdAt: localization.createdAt,
      updatedAt: localization.updatedAt,
    };
  }
}

