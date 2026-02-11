import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSalesRepTerritoryDto } from './dto/create-sales-rep-territory.dto';
import { UpdateSalesRepTerritoryDto } from './dto/update-sales-rep-territory.dto';

@Injectable()
export class SalesRepTerritoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createSalesRepTerritoryDto: CreateSalesRepTerritoryDto) {
    return this.prisma.salesRepTerritory.create({
      data: createSalesRepTerritoryDto,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.salesRepTerritory.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const territory = await this.prisma.salesRepTerritory.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    if (!territory) {
      throw new NotFoundException(`SalesRepTerritory with ID ${id} not found`);
    }
    return territory;
  }

  async update(id: number, updateSalesRepTerritoryDto: UpdateSalesRepTerritoryDto) {
    await this.findOne(id); // Check if exists
    return this.prisma.salesRepTerritory.update({
      where: { id },
      data: updateSalesRepTerritoryDto,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Check if exists
    return this.prisma.salesRepTerritory.delete({
      where: { id },
    });
  }
}

