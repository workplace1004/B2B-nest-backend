import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseOrderBatchDto } from './dto/create-purchase-order-batch.dto';
import { UpdatePurchaseOrderBatchDto } from './dto/update-purchase-order-batch.dto';

@Injectable()
export class PurchaseOrderBatchesService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreatePurchaseOrderBatchDto) {
    return this.prisma.purchaseOrderBatch.create({
      data: {
        ...createDto,
        productionDate: createDto.productionDate ? new Date(createDto.productionDate) : undefined,
        expiryDate: createDto.expiryDate ? new Date(createDto.expiryDate) : undefined,
      },
    });
  }

  async findAll(purchaseOrderId?: number) {
    const where = purchaseOrderId ? { purchaseOrderId } : {};
    return this.prisma.purchaseOrderBatch.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const batch = await this.prisma.purchaseOrderBatch.findUnique({
      where: { id },
    });
    if (!batch) {
      throw new NotFoundException(`Batch with ID ${id} not found`);
    }
    return batch;
  }

  async update(id: number, updateDto: UpdatePurchaseOrderBatchDto) {
    await this.findOne(id);
    return this.prisma.purchaseOrderBatch.update({
      where: { id },
      data: {
        ...updateDto,
        ...(updateDto.productionDate && { productionDate: new Date(updateDto.productionDate) }),
        ...(updateDto.expiryDate && { expiryDate: new Date(updateDto.expiryDate) }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.purchaseOrderBatch.delete({
      where: { id },
    });
  }
}

