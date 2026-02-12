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

    const { lines, supplierId, bOMId, expectedDate, orderDate, receivedDate, ...orderData } = createPurchaseOrderDto;

    const createData: any = {
      ...orderData,
      poNumber,
      totalAmount,
      supplier: { connect: { id: supplierId } },
    };

    // Convert date strings to DateTime objects for Prisma
    if (expectedDate) {
      createData.expectedDate = new Date(expectedDate);
    }
    if (orderDate) {
      createData.orderDate = new Date(orderDate);
    }
    if (receivedDate) {
      createData.receivedDate = new Date(receivedDate);
    }

    // Only include bom connection if bOMId is provided
    if (bOMId) {
      createData.bom = { connect: { id: bOMId } };
    }

    // Only include lines if provided
    if (lines && lines.length > 0) {
      createData.lines = {
        create: lines.map((line) => ({
          ...line,
          totalCost: line.totalCost || Number(line.unitCost) * line.quantity,
        })),
      };
    }

    return this.prisma.purchaseOrder.create({
      data: createData,
      include: {
        supplier: true,
        bom: {
          include: {
            product: true,
          },
        },
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
          bom: {
            include: {
              product: true,
            },
          },
          lines: {
            include: {
              product: true,
            },
          },
          approvals: true,
          wipTracking: true,
          batches: true,
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
    try {
      const purchaseOrder = await this.prisma.purchaseOrder.findUnique({
        where: { id },
        include: {
          supplier: true,
          bom: {
            include: {
              product: true,
            },
          },
          lines: {
            include: {
              product: true,
            },
          },
          approvals: {
            orderBy: {
              level: 'asc',
            },
          },
          wipTracking: {
            orderBy: {
              createdAt: 'desc',
            },
          },
          batches: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

      if (!purchaseOrder) {
        throw new NotFoundException(`Purchase Order with ID ${id} not found`);
      }

      return purchaseOrder;
    } catch (error) {
      console.error(`Error fetching purchase order ${id}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Re-throw with more context
      throw new Error(`Failed to fetch purchase order ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async update(id: number, updatePurchaseOrderDto: UpdatePurchaseOrderDto) {
    await this.findOne(id);

    const { lines, supplierId, bOMId, expectedDate, orderDate, receivedDate, ...orderData } = updatePurchaseOrderDto;

    // Recalculate total if lines are updated
    let updateData: any = { ...orderData };

    // Convert date strings to Date objects for Prisma
    if (expectedDate !== undefined) {
      updateData.expectedDate = expectedDate ? new Date(expectedDate) : null;
    }
    if (orderDate !== undefined) {
      updateData.orderDate = orderDate ? new Date(orderDate) : null;
    }
    if (receivedDate !== undefined) {
      updateData.receivedDate = receivedDate ? new Date(receivedDate) : null;
    }

    if (lines && lines.length > 0) {
      const totalAmount = lines.reduce(
        (sum, line) => sum + Number(line.unitCost) * line.quantity,
        0,
      );
      updateData.totalAmount = totalAmount;
    }

    const updatePayload: any = {
      ...updateData,
    };

    // Handle supplier connection
    if (supplierId !== undefined) {
      updatePayload.supplier = supplierId
        ? { connect: { id: supplierId } }
        : { disconnect: true };
    }

    // Handle BOM connection
    if (bOMId !== undefined) {
      updatePayload.bom = bOMId
        ? { connect: { id: bOMId } }
        : { disconnect: true };
    }

    // Handle lines update
    if (lines !== undefined) {
      updatePayload.lines = lines && lines.length > 0
        ? {
            deleteMany: {},
            create: lines.map((line) => ({
              ...line,
              totalCost: line.totalCost || Number(line.unitCost) * line.quantity,
            })),
          }
        : { deleteMany: {} };
    }

    return this.prisma.purchaseOrder.update({
      where: { id },
      data: updatePayload,
      include: {
        supplier: true,
        bom: {
          include: {
            product: true,
          },
        },
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

