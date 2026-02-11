import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePackSlipDto } from './dto/create-pack-slip.dto';
import { UpdatePackSlipDto } from './dto/update-pack-slip.dto';

@Injectable()
export class PackSlipsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreatePackSlipDto) {
    const packSlipNumber = `PS-${Date.now()}`;
    
    return this.prisma.packSlip.create({
      data: {
        packSlipNumber,
        orderId: createDto.orderId,
        pickListId: createDto.pickListId,
        warehouseId: createDto.warehouseId,
        status: createDto.status || 'DRAFT',
        packedBy: createDto.packedBy,
        packedAt: createDto.packedAt ? new Date(createDto.packedAt) : undefined,
        notes: createDto.notes,
        items: {
          create: createDto.items.map(item => ({
            orderLineId: item.orderLineId,
            productId: item.productId,
            quantity: item.quantity,
            packedQty: item.packedQty || 0,
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
        pickList: true,
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
      this.prisma.packSlip.findMany({
        skip: Number(skip),
        take: Number(take),
        where,
        include: {
          order: {
            include: {
              customer: true,
            },
          },
          pickList: true,
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
      this.prisma.packSlip.count({ where }),
    ]);

    return { data, total, skip, take };
  }

  async findOne(id: string) {
    const packSlip = await this.prisma.packSlip.findUnique({
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
        pickList: true,
        warehouse: true,
        items: {
          include: {
            product: true,
            orderLine: true,
          },
        },
      },
    });
    if (!packSlip) {
      throw new NotFoundException(`Pack slip with ID ${id} not found`);
    }
    return packSlip;
  }

  async update(id: string, updateDto: UpdatePackSlipDto) {
    await this.findOne(id);
    
    const updateData: any = {
      ...(updateDto.status && { status: updateDto.status }),
      ...(updateDto.packedBy !== undefined && { packedBy: updateDto.packedBy }),
      ...(updateDto.packedAt && { packedAt: new Date(updateDto.packedAt) }),
      ...(updateDto.notes !== undefined && { notes: updateDto.notes }),
    };

    if (updateDto.items) {
      updateData.items = {
        deleteMany: {},
        create: updateDto.items.map(item => ({
          orderLineId: item.orderLineId,
          productId: item.productId,
          quantity: item.quantity,
          packedQty: item.packedQty || 0,
          notes: item.notes,
        })),
      };
    }

    return this.prisma.packSlip.update({
      where: { id },
      data: updateData,
      include: {
        order: {
          include: {
            customer: true,
          },
        },
        pickList: true,
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
    return this.prisma.packSlip.delete({
      where: { id },
    });
  }
}

