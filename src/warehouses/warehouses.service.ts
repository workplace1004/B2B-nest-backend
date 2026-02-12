import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
    const warehouse = await this.findOne(id);

    // Check for related records that would prevent deletion (onDelete: Restrict)
    const [pickLists, packSlips, shipments, endlessAisleWarehouses] = await Promise.all([
      this.prisma.pickList.count({ where: { warehouseId: id } }),
      this.prisma.packSlip.count({ where: { warehouseId: id } }),
      this.prisma.shipment.count({ where: { warehouseId: id } }),
      this.prisma.endlessAisleWarehouse.count({ where: { warehouseId: id } }),
    ]);

    const relatedRecords: string[] = [];
    if (pickLists > 0) relatedRecords.push(`${pickLists} pick list(s)`);
    if (packSlips > 0) relatedRecords.push(`${packSlips} pack slip(s)`);
    if (shipments > 0) relatedRecords.push(`${shipments} shipment(s)`);
    if (endlessAisleWarehouses > 0) relatedRecords.push(`${endlessAisleWarehouses} endless aisle warehouse(s)`);

    if (relatedRecords.length > 0) {
      throw new BadRequestException(
        `Cannot delete warehouse "${warehouse.name}" because it has ${relatedRecords.join(', ')}. Please remove or reassign these records first.`
      );
    }

    try {
      return await this.prisma.warehouse.delete({
        where: { id },
      });
    } catch (error: any) {
      console.error('Error deleting warehouse:', error);
      // If there are still foreign key constraints, provide a more helpful error
      if (error.code === 'P2003') {
        throw new BadRequestException(
          `Cannot delete warehouse "${warehouse.name}" because it has related records. Please remove all related records first.`
        );
      }
      // Handle record not found errors
      if (error.code === 'P2025') {
        throw new NotFoundException(`Warehouse with ID ${id} not found`);
      }
      // Re-throw with more context
      throw new BadRequestException(
        `Failed to delete warehouse "${warehouse.name}": ${error.message || 'Unknown error'}`
      );
    }
  }
}

