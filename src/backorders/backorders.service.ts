import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBackorderDto } from './dto/create-backorder.dto';
import { UpdateBackorderDto } from './dto/update-backorder.dto';

@Injectable()
export class BackordersService {
  constructor(private prisma: PrismaService) {}

  async create(createBackorderDto: CreateBackorderDto) {
    return this.prisma.backorder.create({
      data: {
        orderId: createBackorderDto.orderId,
        orderLineId: createBackorderDto.orderLineId,
        productId: createBackorderDto.productId,
        quantity: createBackorderDto.quantity,
        status: createBackorderDto.status ?? 'PENDING',
        allocatedQty: createBackorderDto.allocatedQty ?? 0,
        notes: createBackorderDto.notes,
      },
      include: {
        order: {
          include: {
            customer: true,
          },
        },
        orderLine: true,
        product: true,
      },
    });
  }

  async findAll(orderId?: number, status?: string) {
    const where: any = {};
    if (orderId) where.orderId = orderId;
    if (status && status !== 'all') where.status = status;

    return this.prisma.backorder.findMany({
      where,
      include: {
        order: {
          include: {
            customer: true,
          },
        },
        orderLine: true,
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const backorder = await this.prisma.backorder.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            customer: true,
          },
        },
        orderLine: true,
        product: true,
      },
    });

    if (!backorder) {
      throw new NotFoundException(`Backorder with ID ${id} not found`);
    }

    return backorder;
  }

  async update(id: number, updateBackorderDto: UpdateBackorderDto) {
    await this.findOne(id);

    return this.prisma.backorder.update({
      where: { id },
      data: {
        orderId: updateBackorderDto.orderId,
        orderLineId: updateBackorderDto.orderLineId,
        productId: updateBackorderDto.productId,
        quantity: updateBackorderDto.quantity,
        status: updateBackorderDto.status,
        allocatedQty: updateBackorderDto.allocatedQty,
        notes: updateBackorderDto.notes,
      },
      include: {
        order: {
          include: {
            customer: true,
          },
        },
        orderLine: true,
        product: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.backorder.delete({
      where: { id },
    });
    return { message: 'Backorder deleted successfully' };
  }
}

