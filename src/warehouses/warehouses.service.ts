import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@Injectable()
export class WarehousesService {
  constructor(private prisma: PrismaService) {}

  async create(createWarehouseDto: CreateWarehouseDto) {
    return this.prisma.warehouse.create({
      data: createWarehouseDto,
    });
  }

  async findAll() {
    return this.prisma.warehouse.findMany({
      include: {
        _count: {
          select: { inventory: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
      include: {
        inventory: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }
    return warehouse;
  }

  async update(id: number, updateWarehouseDto: UpdateWarehouseDto) {
    await this.findOne(id);
    return this.prisma.warehouse.update({
      where: { id },
      data: updateWarehouseDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.warehouse.delete({
      where: { id },
    });
  }
}

