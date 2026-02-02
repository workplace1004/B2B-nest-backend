import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePricingDto } from './dto/create-pricing.dto';
import { UpdatePricingDto } from './dto/update-pricing.dto';

@Injectable()
export class PricingService {
  constructor(private prisma: PrismaService) {}

  async create(createPricingDto: CreatePricingDto) {
    const pricing = await this.prisma.productPricing.create({
      data: {
        ...createPricingDto,
        validFrom: createPricingDto.validFrom ? new Date(createPricingDto.validFrom) : new Date(),
        validUntil: createPricingDto.validUntil ? new Date(createPricingDto.validUntil) : null,
      },
      include: {
        product: true,
      },
    });

    return pricing;
  }

  async findAll(skip?: number, take?: number, productId?: number) {
    const where: any = {};
    if (productId) {
      where.productId = productId;
    }

    const pricing = await this.prisma.productPricing.findMany({
      skip,
      take,
      where,
      include: {
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return pricing;
  }

  async findOne(id: number) {
    const pricing = await this.prisma.productPricing.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!pricing) {
      throw new NotFoundException(`Pricing with ID ${id} not found`);
    }

    return pricing;
  }

  async update(id: number, updatePricingDto: UpdatePricingDto) {
    await this.findOne(id);

    const pricing = await this.prisma.productPricing.update({
      where: { id },
      data: {
        ...updatePricingDto,
        validFrom: updatePricingDto.validFrom ? new Date(updatePricingDto.validFrom) : undefined,
        validUntil: updatePricingDto.validUntil ? new Date(updatePricingDto.validUntil) : undefined,
      },
      include: {
        product: true,
      },
    });

    return pricing;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.productPricing.delete({
      where: { id },
    });
    return { message: 'Pricing deleted successfully' };
  }
}

