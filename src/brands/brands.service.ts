import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async create(createBrandDto: CreateBrandDto) {
    // Check if brand code already exists
    const existingBrand = await this.prisma.brand.findUnique({
      where: { code: createBrandDto.code },
    });

    if (existingBrand) {
      throw new BadRequestException('Brand with this code already exists');
    }

    const { marketIds, ...brandData } = createBrandDto;

    // Create brand
    const brand = await this.prisma.brand.create({
      data: brandData,
    });

    // Link markets if provided
    if (marketIds && marketIds.length > 0) {
      await this.prisma.brandMarket.createMany({
        data: marketIds.map((marketId) => ({
          brandId: brand.id,
          marketId,
        })),
        skipDuplicates: true,
      });
    }

    return this.findOne(brand.id);
  }

  async findAll(skip?: number, take?: number, status?: string) {
    const where: any = {};
    if (status && status !== 'all') {
      where.status = status.toUpperCase() as any;
    }

    const [data, total] = await Promise.all([
      this.prisma.brand.findMany({
        skip: skip,
        take: take,
        where,
        orderBy: { name: 'asc' },
        include: {
          brandMarkets: {
            include: {
              market: true,
            },
          },
        },
      }),
      this.prisma.brand.count({ where }),
    ]);

    // Map to include marketIds and market count
    const brands = data.map((brand) => ({
      id: brand.id,
      name: brand.name,
      code: brand.code,
      description: brand.description,
      logo: brand.logo,
      status: brand.status,
      marketIds: brand.brandMarkets.map((bm) => bm.marketId),
      marketCount: brand.brandMarkets.length,
      createdAt: brand.createdAt,
      updatedAt: brand.updatedAt,
    }));

    return {
      data: brands,
      total,
      skip: skip || 0,
      take: take || brands.length,
    };
  }

  async findOne(id: number) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: {
        brandMarkets: {
          include: {
            market: true,
          },
        },
      },
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    return {
      id: brand.id,
      name: brand.name,
      code: brand.code,
      description: brand.description,
      logo: brand.logo,
      status: brand.status,
      marketIds: brand.brandMarkets.map((bm) => bm.marketId),
      marketCount: brand.brandMarkets.length,
      createdAt: brand.createdAt,
      updatedAt: brand.updatedAt,
    };
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    const brand = await this.findOne(id);

    // Check if code is being changed and if new code already exists
    if (updateBrandDto.code && updateBrandDto.code !== brand.code) {
      const existingBrand = await this.prisma.brand.findUnique({
        where: { code: updateBrandDto.code },
      });

      if (existingBrand) {
        throw new BadRequestException('Brand with this code already exists');
      }
    }

    const { marketIds, ...brandData } = updateBrandDto;

    // Update brand
    await this.prisma.brand.update({
      where: { id },
      data: brandData,
    });

    // Update market associations if provided
    if (marketIds !== undefined) {
      // Remove existing associations
      await this.prisma.brandMarket.deleteMany({
        where: { brandId: id },
      });

      // Create new associations
      if (marketIds.length > 0) {
        await this.prisma.brandMarket.createMany({
          data: marketIds.map((marketId) => ({
            brandId: id,
            marketId,
          })),
          skipDuplicates: true,
        });
      }
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    const brand = await this.findOne(id);
    
    // Delete brand (cascade will handle brandMarkets)
    await this.prisma.brand.delete({
      where: { id },
    });

    return brand;
  }
}

