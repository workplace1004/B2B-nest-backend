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
        weight: createDto.weight ? createDto.weight : undefined,
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
    
    console.log('Pack Slip Update - ID:', id);
    console.log('Pack Slip Update - DTO:', JSON.stringify(updateDto, null, 2));
    
    const updateData: any = {};
    
    // Only update fields that are provided
    if (updateDto.orderId !== undefined) {
      updateData.orderId = updateDto.orderId;
    }
    
    if (updateDto.pickListId !== undefined) {
      updateData.pickListId = updateDto.pickListId || null;
    }
    
    if (updateDto.warehouseId !== undefined) {
      updateData.warehouseId = updateDto.warehouseId;
    }
    
    if (updateDto.status !== undefined) {
      updateData.status = updateDto.status;
    }
    
    if (updateDto.packedBy !== undefined) {
      updateData.packedBy = updateDto.packedBy;
    }
    
    if (updateDto.packedAt !== undefined) {
      updateData.packedAt = updateDto.packedAt ? new Date(updateDto.packedAt) : null;
    }
    
    if (updateDto.notes !== undefined) {
      updateData.notes = updateDto.notes;
    }

    // Only include weight if it's provided
    if (updateDto.weight !== undefined) {
      updateData.weight = updateDto.weight;
    }

    // Only update items if provided
    if (updateDto.items !== undefined) {
      if (Array.isArray(updateDto.items) && updateDto.items.length > 0) {
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
      } else {
        // If items is empty array, delete all items
        updateData.items = {
          deleteMany: {},
        };
      }
    }

    console.log('Pack Slip Update - Update Data:', JSON.stringify(updateData, null, 2));

    try {
      return await this.prisma.packSlip.update({
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
    } catch (error: any) {
      console.error('Pack Slip Update Prisma Error:', error);
      console.error('Error Code:', error.code);
      console.error('Error Message:', error.message);
      
      // If weight field doesn't exist in database, remove it and retry
      if (error.message?.includes('Unknown arg `weight`') || error.code === 'P2009' || error.message?.includes('weight')) {
        console.log('Weight field not found, retrying without weight...');
        delete updateData.weight;
        return await this.prisma.packSlip.update({
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
      throw error;
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.packSlip.delete({
      where: { id },
    });
  }
}

