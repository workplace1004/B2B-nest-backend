import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartialShipmentDto } from './dto/create-partial-shipment.dto';
import { UpdatePartialShipmentDto } from './dto/update-partial-shipment.dto';

@Injectable()
export class PartialShipmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createPartialShipmentDto: CreatePartialShipmentDto) {
    // Generate shipment number
    const shipmentNumber = `PS-${Date.now()}`;

    return this.prisma.partialShipment.create({
      data: {
        orderId: createPartialShipmentDto.orderId,
        shipmentNumber,
        status: createPartialShipmentDto.status ?? 'PENDING',
        shippedDate: createPartialShipmentDto.shippedDate ? new Date(createPartialShipmentDto.shippedDate) : null,
        deliveredDate: createPartialShipmentDto.deliveredDate ? new Date(createPartialShipmentDto.deliveredDate) : null,
        trackingNumber: createPartialShipmentDto.trackingNumber,
        carrier: createPartialShipmentDto.carrier,
        notes: createPartialShipmentDto.notes,
        items: {
          create: createPartialShipmentDto.items.map((item) => ({
            orderLineId: item.orderLineId,
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        order: {
          include: {
            customer: true,
          },
        },
        items: {
          include: {
            orderLine: true,
            product: true,
          },
        },
      },
    });
  }

  async findAll(orderId?: number, status?: string) {
    const where: any = {};
    if (orderId) where.orderId = orderId;
    if (status && status !== 'all') where.status = status;

    return this.prisma.partialShipment.findMany({
      where,
      include: {
        order: {
          include: {
            customer: true,
          },
        },
        items: {
          include: {
            orderLine: true,
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const partialShipment = await this.prisma.partialShipment.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            customer: true,
          },
        },
        items: {
          include: {
            orderLine: true,
            product: true,
          },
        },
      },
    });

    if (!partialShipment) {
      throw new NotFoundException(`Partial shipment with ID ${id} not found`);
    }

    return partialShipment;
  }

  async update(id: number, updatePartialShipmentDto: UpdatePartialShipmentDto) {
    await this.findOne(id);

    return this.prisma.partialShipment.update({
      where: { id },
      data: {
        status: updatePartialShipmentDto.status,
        shippedDate: updatePartialShipmentDto.shippedDate ? new Date(updatePartialShipmentDto.shippedDate) : undefined,
        deliveredDate: updatePartialShipmentDto.deliveredDate ? new Date(updatePartialShipmentDto.deliveredDate) : undefined,
        trackingNumber: updatePartialShipmentDto.trackingNumber,
        carrier: updatePartialShipmentDto.carrier,
        notes: updatePartialShipmentDto.notes,
      },
      include: {
        order: {
          include: {
            customer: true,
          },
        },
        items: {
          include: {
            orderLine: true,
            product: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.partialShipment.delete({
      where: { id },
    });
    return { message: 'Partial shipment deleted successfully' };
  }
}

