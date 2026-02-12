import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const orderNumber = `ORD-${Date.now()}`;
    const totalAmount = createOrderDto.orderLines.reduce(
      (sum, line) => sum + Number(line.unitPrice) * line.quantity,
      0,
    );

    return this.prisma.order.create({
      data: {
        ...createOrderDto,
        orderNumber,
        totalAmount,
        orderLines: {
          create: createOrderDto.orderLines.map((line) => ({
            ...line,
            totalPrice: Number(line.unitPrice) * line.quantity,
          })),
        },
      },
      include: {
        customer: true,
        orderLines: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findAll(skip = 0, take = 10, status?: string, customerId?: number, type?: string, search?: string) {
    try {
      const where: any = {};
      if (status && status !== 'all') where.status = status;
      if (customerId) where.customerId = customerId;
      if (type && type !== 'all') {
        // Valid OrderType enum values: B2B, WHOLESALE, DTC
        // Handle special cases and invalid types
        if (type === 'B2B') {
          where.type = { in: ['B2B', 'WHOLESALE'] };
        } else if (type === 'POS') {
          // POS doesn't exist in enum, return empty result
          // Use an impossible condition to return empty array
          where.id = -1; // This will never match any order
        } else if (['B2B', 'WHOLESALE', 'DTC'].includes(type)) {
          where.type = type;
        }
        // If type is invalid and not handled above, don't add type filter
      }
      if (search) {
        where.OR = [
          { orderNumber: { contains: search, mode: 'insensitive' } },
          { customer: { name: { contains: search, mode: 'insensitive' } } },
        ];
      }

      const [data, total] = await Promise.all([
        this.prisma.order.findMany({
          where,
          skip,
          take,
          include: {
            customer: true,
            orderLines: {
              include: {
                product: true,
              },
            },
            shipments: {
              select: {
                id: true,
                status: true,
              },
            },
          },
          orderBy: { orderDate: 'desc' },
        }),
        this.prisma.order.count({ where }),
      ]);
      return { data, total, skip, take };
    } catch (error) {
      console.error('Error in findAll orders:', error);
      // Return empty result on error instead of throwing
      return { data: [], total: 0, skip, take };
    }
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        user: true,
        orderLines: {
          include: {
            product: true,
          },
        },
        shipments: true,
      },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    await this.findOne(id);
    // Extract only the fields that can be updated directly on Order
    const { orderLines, ...orderData } = updateOrderDto;
    const updateData: any = {};
    
    if (orderData.status !== undefined) updateData.status = orderData.status;
    if (orderData.notes !== undefined) updateData.notes = orderData.notes;
    if (orderData.shippingAddress !== undefined) updateData.shippingAddress = orderData.shippingAddress;
    if (orderData.billingAddress !== undefined) updateData.billingAddress = orderData.billingAddress;
    if (orderData.type !== undefined) updateData.type = orderData.type;
    
    return this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        orderLines: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.order.delete({
      where: { id },
    });
  }
}

