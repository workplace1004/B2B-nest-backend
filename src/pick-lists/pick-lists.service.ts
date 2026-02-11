import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePickListDto } from './dto/create-pick-list.dto';
import { UpdatePickListDto } from './dto/update-pick-list.dto';

@Injectable()
export class PickListsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreatePickListDto) {
    const pickListNumber = `PL-${Date.now()}`;
    
    return this.prisma.pickList.create({
      data: {
        pickListNumber,
        orderId: createDto.orderId,
        warehouseId: createDto.warehouseId,
        status: createDto.status || 'DRAFT',
        assignedTo: createDto.assignedTo,
        startedAt: createDto.startedAt ? new Date(createDto.startedAt) : undefined,
        completedAt: createDto.completedAt ? new Date(createDto.completedAt) : undefined,
        notes: createDto.notes,
        items: {
          create: createDto.items.map(item => ({
            orderLineId: item.orderLineId,
            productId: item.productId,
            binLocation: item.binLocation,
            quantity: item.quantity,
            pickedQuantity: item.pickedQuantity || 0,
            status: item.status || 'PENDING',
            notes: item.notes,
          })),
        },
      },
      include: {
        order: {
          include: {
            customer: true,
          },
        },
        warehouse: true,
        items: {
          include: {
            product: true,
            orderLine: true,
          },
        },
      },
    });
  }

  async findAll(
    skip = 0,
    take = 10,
    status?: string,
    warehouseId?: number,
    orderId?: number,
  ) {
    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }
    if (warehouseId) {
      where.warehouseId = warehouseId;
    }
    if (orderId) {
      where.orderId = orderId;
    }

    const [data, total] = await Promise.all([
      this.prisma.pickList.findMany({
        skip: Number(skip),
        take: Number(take),
        where,
        include: {
          order: {
            include: {
              customer: true,
            },
          },
          warehouse: true,
          items: {
            include: {
              product: true,
              orderLine: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.pickList.count({ where }),
    ]);

    return { data, total, skip, take };
  }

  async findOne(id: string) {
    const pickList = await this.prisma.pickList.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            customer: true,
            orderLines: {
              include: {
                product: true,
              },
            },
          },
        },
        warehouse: true,
        items: {
          include: {
            product: true,
            orderLine: true,
          },
        },
      },
    });
    if (!pickList) {
      throw new NotFoundException(`Pick list with ID ${id} not found`);
    }
    return pickList;
  }

  async update(id: string, updateDto: UpdatePickListDto) {
    await this.findOne(id);
    
    const updateData: any = {
      ...(updateDto.status && { status: updateDto.status }),
      ...(updateDto.assignedTo !== undefined && { assignedTo: updateDto.assignedTo }),
      ...(updateDto.startedAt && { startedAt: new Date(updateDto.startedAt) }),
      ...(updateDto.completedAt && { completedAt: new Date(updateDto.completedAt) }),
      ...(updateDto.notes !== undefined && { notes: updateDto.notes }),
    };

    if (updateDto.items) {
      updateData.items = {
        deleteMany: {},
        create: updateDto.items.map(item => ({
          orderLineId: item.orderLineId,
          productId: item.productId,
          binLocation: item.binLocation,
          quantity: item.quantity,
          pickedQuantity: item.pickedQuantity || 0,
          status: item.status || 'PENDING',
          notes: item.notes,
        })),
      };
    }

    return this.prisma.pickList.update({
      where: { id },
      data: updateData,
      include: {
        order: {
          include: {
            customer: true,
          },
        },
        warehouse: true,
        items: {
          include: {
            product: true,
            orderLine: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.pickList.delete({
      where: { id },
    });
  }
}

