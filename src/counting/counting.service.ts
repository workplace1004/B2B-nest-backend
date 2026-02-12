import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCycleCountDto } from './dto/create-cycle-count.dto';
import { UpdateCycleCountDto } from './dto/update-cycle-count.dto';
import { CreatePhysicalInventoryDto } from './dto/create-physical-inventory.dto';
import { UpdatePhysicalInventoryDto } from './dto/update-physical-inventory.dto';
import { UpdateCycleCountItemDto } from './dto/update-cycle-count-item.dto';
import { UpdatePhysicalInventoryItemDto } from './dto/update-physical-inventory-item.dto';

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

    const updateData: any = {
      warehouseId: updateCycleCountDto.warehouseId,
      countType: updateCycleCountDto.countType,
      status: updateCycleCountDto.status,
      scheduledDate: updateCycleCountDto.scheduledDate ? new Date(updateCycleCountDto.scheduledDate) : undefined,
      startDate: updateCycleCountDto.startDate ? new Date(updateCycleCountDto.startDate) : undefined,
      completedDate: updateCycleCountDto.completedDate ? new Date(updateCycleCountDto.completedDate) : undefined,
      assignedTo: updateCycleCountDto.assignedTo,
      notes: updateCycleCountDto.notes,
    };

    const updated = await this.prisma.cycleCount.update({
      where: { id },
      data: updateData,
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
    
    // Prevent starting if already in progress or completed
    if (cycleCount.status === 'IN_PROGRESS') {
      throw new BadRequestException('Cycle count is already in progress');
    }
    if (cycleCount.status === 'COMPLETED') {
      throw new BadRequestException('Cannot start a completed cycle count');
    }
    if (cycleCount.status === 'CANCELLED') {
      throw new BadRequestException('Cannot start a cancelled cycle count');
    }
    
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

  // Update cycle count item
  async updateCycleCountItem(cycleCountId: number, itemId: number, updateItemDto: UpdateCycleCountItemDto) {
    const cycleCount = await this.findOneCycleCount(cycleCountId);
    
    // Verify item belongs to this cycle count
    const item = cycleCount.items.find((i) => i.id === itemId);
    if (!item) {
      throw new NotFoundException(`Cycle count item with ID ${itemId} not found`);
    }

    // Calculate variance if countedQuantity is provided
    let variance: number | undefined;
    let variancePercent: number | undefined;
    if (updateItemDto.countedQuantity !== undefined) {
      variance = updateItemDto.countedQuantity - item.systemQuantity;
      variancePercent = item.systemQuantity > 0 
        ? Number(((variance / item.systemQuantity) * 100).toFixed(2))
        : 0;
    }

    // Determine status based on countedQuantity
    let itemStatus = updateItemDto.status || item.status;
    if (updateItemDto.countedQuantity !== undefined && updateItemDto.countedQuantity !== null) {
      if (itemStatus === 'PENDING') {
        itemStatus = 'COUNTED';
      }
      // Check for discrepancy
      if (variance !== 0) {
        itemStatus = 'DISCREPANCY';
      }
    }

    const updatedItem = await this.prisma.cycleCountItem.update({
      where: { id: itemId },
      data: {
        countedQuantity: updateItemDto.countedQuantity !== undefined ? updateItemDto.countedQuantity : item.countedQuantity,
        status: itemStatus,
        variance,
        variancePercent,
        countedBy: updateItemDto.countedBy || item.countedBy,
        countedAt: updateItemDto.countedAt ? new Date(updateItemDto.countedAt) : (updateItemDto.countedQuantity !== undefined ? new Date() : item.countedAt),
        notes: updateItemDto.notes !== undefined ? updateItemDto.notes : item.notes,
      },
    });

    return updatedItem;
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

    const updateData: any = {
      warehouseId: updatePhysicalInventoryDto.warehouseId,
      status: updatePhysicalInventoryDto.status,
      scheduledDate: updatePhysicalInventoryDto.scheduledDate ? new Date(updatePhysicalInventoryDto.scheduledDate) : undefined,
      startDate: updatePhysicalInventoryDto.startDate ? new Date(updatePhysicalInventoryDto.startDate) : undefined,
      completedDate: updatePhysicalInventoryDto.completedDate ? new Date(updatePhysicalInventoryDto.completedDate) : undefined,
      assignedTo: updatePhysicalInventoryDto.assignedTo,
      notes: updatePhysicalInventoryDto.notes,
    };

    const updated = await this.prisma.physicalInventory.update({
      where: { id },
      data: updateData,
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
    
    // Prevent starting if already in progress or completed
    if (physicalInventory.status === 'IN_PROGRESS') {
      throw new BadRequestException('Physical inventory is already in progress');
    }
    if (physicalInventory.status === 'COMPLETED') {
      throw new BadRequestException('Cannot start a completed physical inventory');
    }
    if (physicalInventory.status === 'CANCELLED') {
      throw new BadRequestException('Cannot start a cancelled physical inventory');
    }
    
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

  // Update physical inventory item
  async updatePhysicalInventoryItem(physicalInventoryId: number, itemId: number, updateItemDto: UpdatePhysicalInventoryItemDto) {
    const physicalInventory = await this.findOnePhysicalInventory(physicalInventoryId);
    
    // Verify item belongs to this physical inventory
    const item = physicalInventory.items.find((i) => i.id === itemId);
    if (!item) {
      throw new NotFoundException(`Physical inventory item with ID ${itemId} not found`);
    }

    // Calculate variance if countedQuantity is provided
    let variance: number | undefined;
    let variancePercent: number | undefined;
    if (updateItemDto.countedQuantity !== undefined) {
      variance = updateItemDto.countedQuantity - item.systemQuantity;
      variancePercent = item.systemQuantity > 0 
        ? Number(((variance / item.systemQuantity) * 100).toFixed(2))
        : 0;
    }

    // Determine status based on countedQuantity
    let itemStatus = updateItemDto.status || item.status;
    if (updateItemDto.countedQuantity !== undefined && updateItemDto.countedQuantity !== null) {
      if (itemStatus === 'PENDING') {
        itemStatus = 'COUNTED';
      }
      // Check for discrepancy
      if (variance !== 0) {
        itemStatus = 'DISCREPANCY';
      }
    }

    const updatedItem = await this.prisma.physicalInventoryItem.update({
      where: { id: itemId },
      data: {
        countedQuantity: updateItemDto.countedQuantity !== undefined ? updateItemDto.countedQuantity : item.countedQuantity,
        status: itemStatus,
        variance,
        variancePercent,
        countedBy: updateItemDto.countedBy || item.countedBy,
        countedAt: updateItemDto.countedAt ? new Date(updateItemDto.countedAt) : (updateItemDto.countedQuantity !== undefined ? new Date() : item.countedAt),
        notes: updateItemDto.notes !== undefined ? updateItemDto.notes : item.notes,
      },
    });

    return updatedItem;
  }
}

