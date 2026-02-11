import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseOrderApprovalDto } from './dto/create-purchase-order-approval.dto';
import { UpdatePurchaseOrderApprovalDto } from './dto/update-purchase-order-approval.dto';

@Injectable()
export class PurchaseOrderApprovalsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreatePurchaseOrderApprovalDto) {
    return this.prisma.purchaseOrderApproval.create({
      data: {
        ...createDto,
        date: createDto.date ? new Date(createDto.date) : new Date(),
      },
    });
  }

  async findAll(purchaseOrderId?: number) {
    const where = purchaseOrderId ? { purchaseOrderId } : {};
    return this.prisma.purchaseOrderApproval.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: number) {
    const approval = await this.prisma.purchaseOrderApproval.findUnique({
      where: { id },
    });
    if (!approval) {
      throw new NotFoundException(`Approval with ID ${id} not found`);
    }
    return approval;
  }

  async update(id: number, updateDto: UpdatePurchaseOrderApprovalDto) {
    await this.findOne(id);
    return this.prisma.purchaseOrderApproval.update({
      where: { id },
      data: {
        ...updateDto,
        ...(updateDto.date && { date: new Date(updateDto.date) }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.purchaseOrderApproval.delete({
      where: { id },
    });
  }
}

