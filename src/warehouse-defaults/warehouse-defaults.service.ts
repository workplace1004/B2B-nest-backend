import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWarehouseDefaultDto } from './dto/create-warehouse-default.dto';
import { UpdateWarehouseDefaultDto } from './dto/update-warehouse-default.dto';

@Injectable()
export class WarehouseDefaultsService {
  constructor(private prisma: PrismaService) {}

  async create(createWarehouseDefaultDto: CreateWarehouseDefaultDto) {
    // Check if code already exists
    const existing = await this.prisma.warehouseDefault.findUnique({
      where: { code: createWarehouseDefaultDto.code },
    });

    if (existing) {
      throw new BadRequestException('Warehouse with this code already exists');
    }

    // If this is set as default, unset other defaults
    if (createWarehouseDefaultDto.isDefault) {
      await this.prisma.warehouseDefault.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    const warehouse = await this.prisma.warehouseDefault.create({
      data: {
        ...createWarehouseDefaultDto,
        status: createWarehouseDefaultDto.status || 'ACTIVE',
      },
    });

    return this.mapWarehouse(warehouse);
  }

  async findAll(skip?: number, take?: number, status?: string) {
    const where: any = {};
    if (status && status !== 'all') {
      where.status = status.toUpperCase() as any;
    }

    const [data, total] = await Promise.all([
      this.prisma.warehouseDefault.findMany({
        skip: skip,
        take: take,
        where,
        orderBy: { name: 'asc' },
      }),
      this.prisma.warehouseDefault.count({ where }),
    ]);

    const warehouses = data.map((warehouse) => this.mapWarehouse(warehouse));

    return {
      data: warehouses,
      total,
      skip: skip || 0,
      take: take || warehouses.length,
    };
  }

  async findOne(id: number) {
    const warehouse = await this.prisma.warehouseDefault.findUnique({
      where: { id },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse default with ID ${id} not found`);
    }

    return this.mapWarehouse(warehouse);
  }

  async update(id: number, updateWarehouseDefaultDto: UpdateWarehouseDefaultDto) {
    const warehouse = await this.findOne(id);

    // Check if code is being changed and if new code already exists
    if (updateWarehouseDefaultDto.code && updateWarehouseDefaultDto.code !== warehouse.code) {
      const existing = await this.prisma.warehouseDefault.findUnique({
        where: { code: updateWarehouseDefaultDto.code },
      });

      if (existing) {
        throw new BadRequestException('Warehouse with this code already exists');
      }
    }

    // If this is being set as default, unset other defaults
    if (updateWarehouseDefaultDto.isDefault === true) {
      await this.prisma.warehouseDefault.updateMany({
        where: { isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const updated = await this.prisma.warehouseDefault.update({
      where: { id },
      data: updateWarehouseDefaultDto,
    });

    return this.mapWarehouse(updated);
  }

  async remove(id: number) {
    const warehouse = await this.findOne(id);
    
    await this.prisma.warehouseDefault.delete({
      where: { id },
    });

    return this.mapWarehouse(warehouse);
  }

  private mapWarehouse(warehouse: any) {
    return {
      id: warehouse.id,
      name: warehouse.name,
      code: warehouse.code,
      address: warehouse.address,
      city: warehouse.city,
      state: warehouse.state,
      country: warehouse.country,
      postalCode: warehouse.postalCode,
      isDefault: warehouse.isDefault,
      status: warehouse.status?.toLowerCase() || 'active',
      capacity: warehouse.capacity,
      description: warehouse.description,
      createdAt: warehouse.createdAt?.toISOString(),
      updatedAt: warehouse.updatedAt?.toISOString(),
    };
  }
}

