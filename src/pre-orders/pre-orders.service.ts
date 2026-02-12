import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePreOrderDto } from './dto/create-pre-order.dto';
import { UpdatePreOrderDto } from './dto/update-pre-order.dto';

@Injectable()
export class PreOrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createPreOrderDto: CreatePreOrderDto) {
    try {
      // Verify that the order exists
      const order = await this.prisma.order.findUnique({
        where: { id: createPreOrderDto.orderId },
      });
      if (!order) {
        throw new BadRequestException(`Order with ID ${createPreOrderDto.orderId} not found`);
      }

      // Verify that the product exists
      const product = await this.prisma.product.findUnique({
        where: { id: createPreOrderDto.productId },
      });
      if (!product) {
        throw new BadRequestException(`Product with ID ${createPreOrderDto.productId} not found`);
      }

      return await this.prisma.preOrder.create({
        data: {
          orderId: createPreOrderDto.orderId,
          orderLineId: createPreOrderDto.orderLineId,
          productId: createPreOrderDto.productId,
          quantity: createPreOrderDto.quantity,
          expectedDate: createPreOrderDto.expectedDate ? new Date(createPreOrderDto.expectedDate) : null,
          status: createPreOrderDto.status ?? 'PENDING',
          notes: createPreOrderDto.notes,
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
    } catch (error: any) {
      console.error('Error creating pre-order:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error.code === 'P2003') {
        // Foreign key constraint failed
        throw new BadRequestException('Invalid order or product ID. Please check that the order and product exist.');
      }
      throw new BadRequestException(`Failed to create pre-order: ${error.message || 'Unknown error'}`);
    }
  }

  async findAll(orderId?: number, status?: string) {
    const where: any = {};
    if (orderId) where.orderId = orderId;
    if (status && status !== 'all') where.status = status;

    return this.prisma.preOrder.findMany({
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
      orderBy: { expectedDate: 'asc' },
    });
  }

  async findOne(id: number) {
    const preOrder = await this.prisma.preOrder.findUnique({
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

    if (!preOrder) {
      throw new NotFoundException(`Pre-order with ID ${id} not found`);
    }

    return preOrder;
  }

  async update(id: number, updatePreOrderDto: UpdatePreOrderDto) {
    await this.findOne(id);

    return this.prisma.preOrder.update({
      where: { id },
      data: {
        orderId: updatePreOrderDto.orderId,
        orderLineId: updatePreOrderDto.orderLineId,
        productId: updatePreOrderDto.productId,
        quantity: updatePreOrderDto.quantity,
        expectedDate: updatePreOrderDto.expectedDate ? new Date(updatePreOrderDto.expectedDate) : undefined,
        status: updatePreOrderDto.status,
        notes: updatePreOrderDto.notes,
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
    await this.prisma.preOrder.delete({
      where: { id },
    });
    return { message: 'Pre-order deleted successfully' };
  }
}

