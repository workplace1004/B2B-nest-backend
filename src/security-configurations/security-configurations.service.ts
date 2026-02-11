import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SecurityConfigurationType } from '@prisma/client';

@Injectable()
export class SecurityConfigurationsService {
  constructor(private prisma: PrismaService) {}

  async upsert(type: SecurityConfigurationType, data: any) {
    return this.prisma.securityConfiguration.upsert({
      where: { type },
      update: { data },
      create: { type, data },
    });
  }

  async findOne(type: SecurityConfigurationType) {
    const config = await this.prisma.securityConfiguration.findUnique({
      where: { type },
    });

    if (!config) {
      // Return empty array as default
      return { type, data: [] };
    }

    return config;
  }

  async findAll() {
    return this.prisma.securityConfiguration.findMany({
      orderBy: { type: 'asc' },
    });
  }
}

