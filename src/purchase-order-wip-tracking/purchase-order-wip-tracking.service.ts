import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseOrderWIPTrackingDto } from './dto/create-purchase-order-wip-tracking.dto';
import { UpdatePurchaseOrderWIPTrackingDto } from './dto/update-purchase-order-wip-tracking.dto';

@Injectable()
export class PurchaseOrderWIPTrackingService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreatePurchaseOrderWIPTrackingDto) {
    return this.prisma.purchaseOrderWIPTracking.create({
      data: {
        ...createDto,
        completedQty: createDto.completedQty || 0,
        startDate: createDto.startDate ? new Date(createDto.startDate) : undefined,
        completionDate: createDto.completionDate ? new Date(createDto.completionDate) : undefined,
      },
    });
  }

  async findAll(purchaseOrderId?: number) {
    const where = purchaseOrderId ? { purchaseOrderId } : {};
    return this.prisma.purchaseOrderWIPTracking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const wip = await this.prisma.purchaseOrderWIPTracking.findUnique({
      where: { id },
    });
    if (!wip) {
      throw new NotFoundException(`WIP Tracking with ID ${id} not found`);
    }
    return wip;
  }

  async update(id: number, updateDto: UpdatePurchaseOrderWIPTrackingDto) {
    await this.findOne(id);
    return this.prisma.purchaseOrderWIPTracking.update({
      where: { id },
      data: {
        ...updateDto,
        ...(updateDto.startDate && { startDate: new Date(updateDto.startDate) }),
        ...(updateDto.completionDate && { completionDate: new Date(updateDto.completionDate) }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.purchaseOrderWIPTracking.delete({
      where: { id },
    });
  }
}

