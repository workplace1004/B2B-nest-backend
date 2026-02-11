import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class B2BTermsConfigurationsService {
  constructor(private prisma: PrismaService) {}

  async upsert(data: any) {
    // There's only one B2B terms configuration
    const existing = await this.prisma.b2BTermsConfiguration.findFirst();
    if (existing) {
      return this.prisma.b2BTermsConfiguration.update({
        where: { id: existing.id },
        data: { data },
      });
    }
    return this.prisma.b2BTermsConfiguration.create({
      data: { data },
    });
  }

  async findOne() {
    const config = await this.prisma.b2BTermsConfiguration.findFirst();
    if (!config) {
      return { data: [] };
    }
    return config;
  }
}

