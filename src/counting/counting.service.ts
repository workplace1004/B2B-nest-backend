import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCycleCountDto } from './dto/create-cycle-count.dto';
import { UpdateCycleCountDto } from './dto/update-cycle-count.dto';
import { CreatePhysicalInventoryDto } from './dto/create-physical-inventory.dto';
import { UpdatePhysicalInventoryDto } from './dto/update-physical-inventory.dto';

@Injectable()
export class CountingService {
  constructor(private prisma: PrismaService) {}

  // Cycle Count Methods
  async createCycleCount(createCycleCountDto: CreateCycleCountDto) {
    // Generate count number
    const countNumber = `CC-${Date.now()}`;

    const cycleCount = await this.prisma.cycleCount.create({
      data: {
        countNumber,
        warehouseId: createCycleCountDto.warehouseId,
        countType: createCycleCountDto.countType,
        status: 'DRAFT',
        scheduledDate: new Date(createCycleCountDto.scheduledDate),
        assignedTo: createCycleCountDto.assignedTo,
        notes: createCycleCountDto.notes,
        items: createCycleCountDto.items
          ? {
              create: createCycleCountDto.items.map((item) => ({
                productId: item.productId,
                productName: item.productName,
                sku: item.sku,
                binLocation: item.binLocation,
                systemQuantity: item.systemQuantity,
                countedQuantity: item.countedQuantity,
                notes: item.notes,
              })),
            }
          : undefined,
      },
      include: {
        warehouse: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return cycleCount;
  }

  async findAllCycleCounts(warehouseId?: number, status?: string) {
    const where: any = {};
    if (warehouseId) where.warehouseId = warehouseId;
    if (status && status !== 'all') where.status = status;

    return this.prisma.cycleCount.findMany({
      where,
      include: {
        warehouse: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        scheduledDate: 'desc',
      },
    });
  }

  async findOneCycleCount(id: number) {
    const cycleCount = await this.prisma.cycleCount.findUnique({
      where: { id },
      include: {
        warehouse: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cycleCount) {
      throw new NotFoundException(`Cycle count with ID ${id} not found`);
    }

    return cycleCount;
  }

  async updateCycleCount(id: number, updateCycleCountDto: UpdateCycleCountDto) {
    const cycleCount = await this.findOneCycleCount(id);

    const updated = await this.prisma.cycleCount.update({
      where: { id },
      data: {
        warehouseId: updateCycleCountDto.warehouseId,
        countType: updateCycleCountDto.countType,
        status: updateCycleCountDto.status,
        scheduledDate: updateCycleCountDto.scheduledDate ? new Date(updateCycleCountDto.scheduledDate) : undefined,
        startDate: updateCycleCountDto.startDate ? new Date(updateCycleCountDto.startDate) : undefined,
        completedDate: updateCycleCountDto.completedDate ? new Date(updateCycleCountDto.completedDate) : undefined,
        assignedTo: updateCycleCountDto.assignedTo,
        notes: updateCycleCountDto.notes,
      },
      include: {
        warehouse: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return updated;
  }

  async deleteCycleCount(id: number) {
    await this.findOneCycleCount(id);
    await this.prisma.cycleCount.delete({
      where: { id },
    });
    return { message: 'Cycle count deleted successfully' };
  }

  async startCycleCount(id: number) {
    const cycleCount = await this.findOneCycleCount(id);
    
    return this.prisma.cycleCount.update({
      where: { id },
      data: {
        status: 'IN_PROGRESS',
        startDate: new Date(),
      },
      include: {
        warehouse: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  // Physical Inventory Methods
  async createPhysicalInventory(createPhysicalInventoryDto: CreatePhysicalInventoryDto) {
    // Generate inventory number
    const inventoryNumber = `PI-${Date.now()}`;

    const physicalInventory = await this.prisma.physicalInventory.create({
      data: {
        inventoryNumber,
        warehouseId: createPhysicalInventoryDto.warehouseId,
        status: 'DRAFT',
        scheduledDate: new Date(createPhysicalInventoryDto.scheduledDate),
        assignedTo: createPhysicalInventoryDto.assignedTo,
        notes: createPhysicalInventoryDto.notes,
        items: createPhysicalInventoryDto.items
          ? {
              create: createPhysicalInventoryDto.items.map((item) => ({
                productId: item.productId,
                productName: item.productName,
                sku: item.sku,
                binLocation: item.binLocation,
                systemQuantity: item.systemQuantity,
                countedQuantity: item.countedQuantity,
                notes: item.notes,
              })),
            }
          : undefined,
      },
      include: {
        warehouse: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return physicalInventory;
  }

  async findAllPhysicalInventories(warehouseId?: number, status?: string) {
    const where: any = {};
    if (warehouseId) where.warehouseId = warehouseId;
    if (status && status !== 'all') where.status = status;

    return this.prisma.physicalInventory.findMany({
      where,
      include: {
        warehouse: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        scheduledDate: 'desc',
      },
    });
  }

  async findOnePhysicalInventory(id: number) {
    const physicalInventory = await this.prisma.physicalInventory.findUnique({
      where: { id },
      include: {
        warehouse: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!physicalInventory) {
      throw new NotFoundException(`Physical inventory with ID ${id} not found`);
    }

    return physicalInventory;
  }

  async updatePhysicalInventory(id: number, updatePhysicalInventoryDto: UpdatePhysicalInventoryDto) {
    const physicalInventory = await this.findOnePhysicalInventory(id);

    const updated = await this.prisma.physicalInventory.update({
      where: { id },
      data: {
        warehouseId: updatePhysicalInventoryDto.warehouseId,
        status: updatePhysicalInventoryDto.status,
        scheduledDate: updatePhysicalInventoryDto.scheduledDate ? new Date(updatePhysicalInventoryDto.scheduledDate) : undefined,
        startDate: updatePhysicalInventoryDto.startDate ? new Date(updatePhysicalInventoryDto.startDate) : undefined,
        completedDate: updatePhysicalInventoryDto.completedDate ? new Date(updatePhysicalInventoryDto.completedDate) : undefined,
        assignedTo: updatePhysicalInventoryDto.assignedTo,
        notes: updatePhysicalInventoryDto.notes,
      },
      include: {
        warehouse: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return updated;
  }

  async deletePhysicalInventory(id: number) {
    await this.findOnePhysicalInventory(id);
    await this.prisma.physicalInventory.delete({
      where: { id },
    });
    return { message: 'Physical inventory deleted successfully' };
  }

  async startPhysicalInventory(id: number) {
    const physicalInventory = await this.findOnePhysicalInventory(id);
    
    return this.prisma.physicalInventory.update({
      where: { id },
      data: {
        status: 'IN_PROGRESS',
        startDate: new Date(),
      },
      include: {
        warehouse: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}

