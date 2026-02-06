import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';

@Injectable()
export class MarketsService {
  constructor(private prisma: PrismaService) {}

  async create(createMarketDto: CreateMarketDto) {
    // Check if market code already exists
    const existingMarket = await this.prisma.market.findUnique({
      where: { code: createMarketDto.code },
    });

    if (existingMarket) {
      throw new BadRequestException('Market with this code already exists');
    }

    const { brandIds, ...marketData } = createMarketDto;

    // Create market
    const market = await this.prisma.market.create({
      data: marketData,
    });

    // Link brands if provided
    if (brandIds && brandIds.length > 0) {
      await this.prisma.brandMarket.createMany({
        data: brandIds.map((brandId) => ({
          brandId,
          marketId: market.id,
        })),
        skipDuplicates: true,
      });
    }

    return this.findOne(market.id);
  }

  async findAll(skip?: number, take?: number, status?: string) {
    const where: any = {};
    if (status && status !== 'all') {
      where.status = status.toUpperCase() as any;
    }

    const [data, total] = await Promise.all([
      this.prisma.market.findMany({
        skip: skip,
        take: take,
        where,
        orderBy: { name: 'asc' },
        include: {
          brandMarkets: {
            include: {
              brand: true,
            },
          },
        },
      }),
      this.prisma.market.count({ where }),
    ]);

    // Map to include brandIds and brand count
    const markets = data.map((market) => ({
      id: market.id,
      name: market.name,
      code: market.code,
      region: market.region,
      country: market.country,
      currency: market.currency,
      language: market.language,
      timezone: market.timezone,
      status: market.status,
      brandIds: market.brandMarkets.map((bm) => bm.brandId),
      brandCount: market.brandMarkets.length,
      createdAt: market.createdAt,
      updatedAt: market.updatedAt,
    }));

    return {
      data: markets,
      total,
      skip: skip || 0,
      take: take || markets.length,
    };
  }

  async findOne(id: number) {
    const market = await this.prisma.market.findUnique({
      where: { id },
      include: {
        brandMarkets: {
          include: {
            brand: true,
          },
        },
      },
    });

    if (!market) {
      throw new NotFoundException(`Market with ID ${id} not found`);
    }

    return {
      id: market.id,
      name: market.name,
      code: market.code,
      region: market.region,
      country: market.country,
      currency: market.currency,
      language: market.language,
      timezone: market.timezone,
      status: market.status,
      brandIds: market.brandMarkets.map((bm) => bm.brandId),
      brandCount: market.brandMarkets.length,
      createdAt: market.createdAt,
      updatedAt: market.updatedAt,
    };
  }

  async update(id: number, updateMarketDto: UpdateMarketDto) {
    const market = await this.findOne(id);

    // Check if code is being changed and if new code already exists
    if (updateMarketDto.code && updateMarketDto.code !== market.code) {
      const existingMarket = await this.prisma.market.findUnique({
        where: { code: updateMarketDto.code },
      });

      if (existingMarket) {
        throw new BadRequestException('Market with this code already exists');
      }
    }

    const { brandIds, ...marketData } = updateMarketDto;

    // Update market
    await this.prisma.market.update({
      where: { id },
      data: marketData,
    });

    // Update brand associations if provided
    if (brandIds !== undefined) {
      // Remove existing associations
      await this.prisma.brandMarket.deleteMany({
        where: { marketId: id },
      });

      // Create new associations
      if (brandIds.length > 0) {
        await this.prisma.brandMarket.createMany({
          data: brandIds.map((brandId) => ({
            brandId,
            marketId: id,
          })),
          skipDuplicates: true,
        });
      }
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    const market = await this.findOne(id);
    
    // Delete market (cascade will handle brandMarkets and localizations)
    await this.prisma.market.delete({
      where: { id },
    });

    return market;
  }
}

