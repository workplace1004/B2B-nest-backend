import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockControlConfigurationType } from '@prisma/client';

@Injectable()
export class StockControlConfigurationsService {
  constructor(private prisma: PrismaService) {}

  async upsert(type: StockControlConfigurationType, data: any) {
    return this.prisma.stockControlConfiguration.upsert({
      where: { type },
      update: { data },
      create: { type, data },
    });
  }

  async findOne(type: StockControlConfigurationType) {
    const config = await this.prisma.stockControlConfiguration.findUnique({
      where: { type },
    });

    if (!config) {
      // Return empty array/object as default
      return { type, data: type === 'APPROVALS' ? {} : [] };
    }

    return config;
  }

  async findAll() {
    return this.prisma.stockControlConfiguration.findMany({
      orderBy: { type: 'asc' },
    });
  }
}

