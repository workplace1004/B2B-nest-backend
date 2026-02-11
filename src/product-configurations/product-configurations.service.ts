import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProductConfigurationDto } from './dto/update-product-configuration.dto';
import { ProductConfigurationType } from '@prisma/client';

@Injectable()
export class ProductConfigurationsService {
  constructor(private prisma: PrismaService) {}

  async upsert(type: ProductConfigurationType, data: any) {
    return this.prisma.productConfiguration.upsert({
      where: { type },
      update: { data },
      create: { type, data },
    });
  }

  async findOne(type: ProductConfigurationType) {
    const config = await this.prisma.productConfiguration.findUnique({
      where: { type },
    });

    if (!config) {
      // Return empty array as default
      return { type, data: [] };
    }

    return config;
  }

  async findAll() {
    return this.prisma.productConfiguration.findMany({
      orderBy: { type: 'asc' },
    });
  }
}

