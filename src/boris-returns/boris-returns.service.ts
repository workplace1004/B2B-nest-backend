import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBORISReturnDto } from './dto/create-boris-return.dto';
import { UpdateBORISReturnDto } from './dto/update-boris-return.dto';

@Injectable()
export class BORISReturnsService {
  constructor(private prisma: PrismaService) {}

  async create(createBORISReturnDto: CreateBORISReturnDto) {
    const { items, ...returnData } = createBORISReturnDto;

    const borisReturn = await this.prisma.bORISReturn.create({
      data: {
        ...returnData,
        items: {
          create: items,
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

    return borisReturn;
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
          { returnNumber: { contains: search, mode: 'insensitive' } },
          { order: { orderNumber: { contains: search, mode: 'insensitive' } } },
          { customer: { name: { contains: search, mode: 'insensitive' } } },
          { store: { name: { contains: search, mode: 'insensitive' } } },
        ];
      }

      const [data, total] = await Promise.all([
        this.prisma.bORISReturn.findMany({
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
            returnDate: 'desc',
          },
        }),
        this.prisma.bORISReturn.count({ where }),
      ]);

      return { data, total, skip, take };
    } catch (error) {
      console.error('Error in BORISReturnsService.findAll:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    const borisReturn = await this.prisma.bORISReturn.findUnique({
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

    if (!borisReturn) {
      throw new NotFoundException(`BORIS Return with ID ${id} not found`);
    }

    return borisReturn;
  }

  async update(id: number, updateBORISReturnDto: UpdateBORISReturnDto) {
    await this.findOne(id);

    const { items, ...updateData } = updateBORISReturnDto;

    const updatePayload: any = { ...updateData };
    if (items) {
      // Delete existing items and create new ones
      await this.prisma.bORISReturnItem.deleteMany({
        where: { borisReturnId: id },
      });
      updatePayload.items = {
        create: items,
      };
    }

    const borisReturn = await this.prisma.bORISReturn.update({
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

    return borisReturn;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.bORISReturn.delete({
      where: { id },
    });
    return { message: 'BORIS Return deleted successfully' };
  }
}

