import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';

@Injectable()
export class PurchaseOrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createPurchaseOrderDto: CreatePurchaseOrderDto) {
    const poNumber = `PO-${Date.now()}`;

    // Calculate total amount if lines are provided
    let totalAmount = createPurchaseOrderDto.totalAmount || 0;

    if (createPurchaseOrderDto.lines && createPurchaseOrderDto.lines.length > 0) {
      totalAmount = createPurchaseOrderDto.lines.reduce(
        (sum, line) => sum + Number(line.unitCost) * line.quantity,
        0,
      );
    }

    const { lines, supplierId, ...orderData } = createPurchaseOrderDto;

    return this.prisma.purchaseOrder.create({
      data: {
        ...orderData,
        poNumber,
        totalAmount,
        supplier: { connect: { id: supplierId } },
        lines: lines
          ? {
              create: lines.map((line) => ({
                ...line,
                totalCost: line.totalCost || Number(line.unitCost) * line.quantity,
              })),
            }
          : undefined,
      },
      include: {
        supplier: true,
        lines: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findAll(skip = 0, take = 10, status?: string, supplierId?: string) {
    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (supplierId) {
      where.supplierId = parseInt(supplierId);
    }

    const [data, total] = await Promise.all([
      this.prisma.purchaseOrder.findMany({
        skip: Number(skip),
        take: Number(take),
        where,
        include: {
          supplier: true,
          lines: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.purchaseOrder.count({ where }),
    ]);

    return { data, total, skip, take };
  }

  async findOne(id: number) {
    const purchaseOrder = await this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        supplier: true,
        lines: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!purchaseOrder) {
      throw new NotFoundException(`Purchase Order with ID ${id} not found`);
    }

    return purchaseOrder;
  }

  async update(id: number, updatePurchaseOrderDto: UpdatePurchaseOrderDto) {
    await this.findOne(id);

    const { lines, supplierId, ...orderData } = updatePurchaseOrderDto;

    // Recalculate total if lines are updated
    let updateData: any = { ...orderData };

    if (lines && lines.length > 0) {
      const totalAmount = lines.reduce(
        (sum, line) => sum + Number(line.unitCost) * line.quantity,
        0,
      );
      updateData.totalAmount = totalAmount;
    }

    return this.prisma.purchaseOrder.update({
      where: { id },
      data: {
        ...updateData,
        supplier: supplierId
          ? { connect: { id: supplierId } }
          : undefined,
        lines: lines
          ? {
              deleteMany: {},
              create: lines.map((line) => ({
                ...line,
                totalCost: line.totalCost || Number(line.unitCost) * line.quantity,
              })),
            }
          : undefined,
      },
      include: {
        supplier: true,
        lines: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.purchaseOrder.delete({
      where: { id },
    });
  }
}

