import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WarehouseConfigurationType } from '@prisma/client';

@Injectable()
export class WarehouseConfigurationsService {
  constructor(private prisma: PrismaService) {}

  async upsert(type: WarehouseConfigurationType, data: any) {
    return this.prisma.warehouseConfiguration.upsert({
      where: { type },
      update: { data },
      create: { type, data },
    });
  }

  async findOne(type: WarehouseConfigurationType) {
    const config = await this.prisma.warehouseConfiguration.findUnique({
      where: { type },
    });

    if (!config) {
      // Return empty array as default
      return { type, data: [] };
    }

    return config;
  }

  async findAll() {
    return this.prisma.warehouseConfiguration.findMany({
      orderBy: { type: 'asc' },
    });
  }
}

