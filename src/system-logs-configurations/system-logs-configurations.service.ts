import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SystemLogsConfigurationsService {
  constructor(private prisma: PrismaService) {}

  async upsert(data: any) {
    // There's only one system logs configuration
    const existing = await this.prisma.systemLogsConfiguration.findFirst();
    if (existing) {
      return this.prisma.systemLogsConfiguration.update({
        where: { id: existing.id },
        data: { data },
      });
    }
    return this.prisma.systemLogsConfiguration.create({
      data: { data },
    });
  }

  async findOne() {
    const config = await this.prisma.systemLogsConfiguration.findFirst();
    if (!config) {
      return { data: [] };
    }
    return config;
  }
}

