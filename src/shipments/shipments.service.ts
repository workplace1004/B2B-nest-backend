import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';

@Injectable()
export class ShipmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createShipmentDto: CreateShipmentDto) {
    const shipmentNumber = `SHIP-${Date.now()}`;
    const { orderId, warehouseId, ...shipmentData } = createShipmentDto;

    return this.prisma.shipment.create({
      data: {
        ...shipmentData,
        shipmentNumber,
        order: { connect: { id: orderId } },
        warehouse: { connect: { id: warehouseId } },
      },
      include: {
        order: true,
        warehouse: true,
      },
    });
  }

  async findAll(skip = 0, take = 10, status?: string, orderId?: string, warehouseId?: string) {
    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (orderId) {
      where.orderId = parseInt(orderId);
    }
    if (warehouseId) {
      where.warehouseId = parseInt(warehouseId);
    }

    const [data, total] = await Promise.all([
      this.prisma.shipment.findMany({
        skip: Number(skip),
        take: Number(take),
        where,
        include: {
          order: true,
          warehouse: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.shipment.count({ where }),
    ]);

    return { data, total, skip, take };
  }

  async findOne(id: number) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id },
      include: {
        order: true,
        warehouse: true,
      },
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }

    return shipment;
  }

  async update(id: number, updateShipmentDto: UpdateShipmentDto) {
    await this.findOne(id);
    const { orderId, warehouseId, ...shipmentData } = updateShipmentDto;

    return this.prisma.shipment.update({
      where: { id },
      data: {
        ...shipmentData,
        order: orderId ? { connect: { id: orderId } } : undefined,
        warehouse: warehouseId
          ? { connect: { id: warehouseId } }
          : undefined,
      },
      include: {
        order: true,
        warehouse: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.shipment.delete({
      where: { id },
    });
  }
}

