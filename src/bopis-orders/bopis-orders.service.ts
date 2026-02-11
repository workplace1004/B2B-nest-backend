import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBOPISOrderDto } from './dto/create-bopis-order.dto';
import { UpdateBOPISOrderDto } from './dto/update-bopis-order.dto';

@Injectable()
export class BOPISOrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createBOPISOrderDto: CreateBOPISOrderDto) {
    const { items, ...orderData } = createBOPISOrderDto;

    const bopisOrder = await this.prisma.bOPISOrder.create({
      data: {
        ...orderData,
        items: {
          create: items.map((item) => ({
            ...item,
            readyAt: item.readyAt ? new Date(item.readyAt) : null,
          })),
        },
      },
      include: {
        order: {
          include: {
            customer: true,
          },
        },
        customer: true,
        store: true,
        items: {
          include: {
            product: true,
            orderLine: true,
          },
        },
      },
    });

    return bopisOrder;
  }

  async findAll(skip = 0, take = 10, status?: string, storeId?: number, search?: string) {
    try {
      const where: any = {};
      if (status && status !== 'all') {
        where.status = status;
      }
      if (storeId) {
        where.storeId = storeId;
      }
      if (search) {
        where.OR = [
          { orderNumber: { contains: search, mode: 'insensitive' } },
          { customer: { name: { contains: search, mode: 'insensitive' } } },
          { store: { name: { contains: search, mode: 'insensitive' } } },
        ];
      }

      const [data, total] = await Promise.all([
        this.prisma.bOPISOrder.findMany({
          skip: Number(skip),
          take: Number(take),
          where,
          include: {
            order: {
              include: {
                customer: true,
              },
            },
            customer: true,
            store: true,
            items: {
              include: {
                product: true,
                orderLine: true,
              },
            },
          },
          orderBy: {
            orderDate: 'desc',
          },
        }),
        this.prisma.bOPISOrder.count({ where }),
      ]);

      return { data, total, skip, take };
    } catch (error) {
      console.error('Error in BOPISOrdersService.findAll:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    const bopisOrder = await this.prisma.bOPISOrder.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            customer: true,
            orderLines: true,
          },
        },
        customer: true,
        store: true,
        items: {
          include: {
            product: true,
            orderLine: true,
          },
        },
      },
    });

    if (!bopisOrder) {
      throw new NotFoundException(`BOPIS Order with ID ${id} not found`);
    }

    return bopisOrder;
  }

  async update(id: number, updateBOPISOrderDto: UpdateBOPISOrderDto) {
    await this.findOne(id);

    const { items, ...updateData } = updateBOPISOrderDto;

    const updatePayload: any = { ...updateData };
    if (items) {
      // Delete existing items and create new ones
      await this.prisma.bOPISOrderItem.deleteMany({
        where: { bopisOrderId: id },
      });
      updatePayload.items = {
        create: items.map((item: any) => ({
          ...item,
          readyAt: item.readyAt ? new Date(item.readyAt) : null,
        })),
      };
    }

    const bopisOrder = await this.prisma.bOPISOrder.update({
      where: { id },
      data: updatePayload,
      include: {
        order: {
          include: {
            customer: true,
          },
        },
        customer: true,
        store: true,
        items: {
          include: {
            product: true,
            orderLine: true,
          },
        },
      },
    });

    return bopisOrder;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.bOPISOrder.delete({
      where: { id },
    });
    return { message: 'BOPIS Order deleted successfully' };
  }
}

