import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShippingLabelDto } from './dto/create-shipping-label.dto';
import { UpdateShippingLabelDto } from './dto/update-shipping-label.dto';

@Injectable()
export class ShippingLabelsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateShippingLabelDto) {
    const labelNumber = `SL-${Date.now()}`;
    
    return this.prisma.shippingLabel.create({
      data: {
        labelNumber,
        orderId: createDto.orderId,
        packSlipId: createDto.packSlipId,
        carrier: createDto.carrier,
        trackingNumber: createDto.trackingNumber,
        serviceType: createDto.serviceType,
        status: createDto.status || 'PENDING',
        weight: createDto.weight,
        dimensions: createDto.dimensions,
        cost: createDto.cost,
        printedAt: createDto.printedAt ? new Date(createDto.printedAt) : undefined,
        shippedAt: createDto.shippedAt ? new Date(createDto.shippedAt) : undefined,
        notes: createDto.notes,
      },
      include: {
        order: {
          include: {
            customer: true,
          },
        },
        packSlip: true,
      },
    });
  }

  async findAll(
    skip = 0,
    take = 10,
    status?: string,
    orderId?: number,
    packSlipId?: string,
  ) {
    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }
    if (orderId) {
      where.orderId = orderId;
    }
    if (packSlipId) {
      where.packSlipId = packSlipId;
    }

    const [data, total] = await Promise.all([
      this.prisma.shippingLabel.findMany({
        skip: Number(skip),
        take: Number(take),
        where,
        include: {
          order: {
            include: {
              customer: true,
            },
          },
          packSlip: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.shippingLabel.count({ where }),
    ]);

    return { data, total, skip, take };
  }

  async findOne(id: string) {
    const shippingLabel = await this.prisma.shippingLabel.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            customer: true,
          },
        },
        packSlip: true,
      },
    });
    if (!shippingLabel) {
      throw new NotFoundException(`Shipping label with ID ${id} not found`);
    }
    return shippingLabel;
  }

  async update(id: string, updateDto: UpdateShippingLabelDto) {
    await this.findOne(id);
    
    return this.prisma.shippingLabel.update({
      where: { id },
      data: {
        ...updateDto,
        ...(updateDto.printedAt && { printedAt: new Date(updateDto.printedAt) }),
        ...(updateDto.shippedAt && { shippedAt: new Date(updateDto.shippedAt) }),
      },
      include: {
        order: {
          include: {
            customer: true,
          },
        },
        packSlip: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.shippingLabel.delete({
      where: { id },
    });
  }
}

