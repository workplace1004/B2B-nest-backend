import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { UpdateIntegrationDto } from './dto/update-integration.dto';

@Injectable()
export class IntegrationsService {
  constructor(private prisma: PrismaService) {}

  async create(createIntegrationDto: CreateIntegrationDto) {
    const integration = await this.prisma.integration.create({
      data: createIntegrationDto,
    });

    return integration;
  }

  async findAll(skip?: number, take?: number, type?: string) {
    const where: any = {};
    if (type) {
      where.type = type;
    }

    const integrations = await this.prisma.integration.findMany({
      skip,
      take,
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return integrations;
  }

  async findOne(id: number) {
    const integration = await this.prisma.integration.findUnique({
      where: { id },
    });

    if (!integration) {
      throw new NotFoundException(`Integration with ID ${id} not found`);
    }

    return integration;
  }

  async update(id: number, updateIntegrationDto: UpdateIntegrationDto) {
    await this.findOne(id);

    const integration = await this.prisma.integration.update({
      where: { id },
      data: updateIntegrationDto,
    });

    return integration;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.integration.delete({
      where: { id },
    });
    return { message: 'Integration deleted successfully' };
  }
}

