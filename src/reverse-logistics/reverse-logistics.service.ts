import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReverseLogisticsDto } from './dto/create-reverse-logistics.dto';
import { UpdateReverseLogisticsDto } from './dto/update-reverse-logistics.dto';

@Injectable()
export class ReverseLogisticsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateReverseLogisticsDto) {
    return this.prisma.reverseLogistics.create({
      data: {
        rmaId: createDto.rmaId,
        trackingNumber: createDto.trackingNumber,
        carrier: createDto.carrier,
        status: createDto.status || 'PENDING',
        originName: createDto.originName,
        originAddress: createDto.originAddress,
        originCity: createDto.originCity,
        originState: createDto.originState,
        originPostalCode: createDto.originPostalCode,
        originCountry: createDto.originCountry,
        destinationName: createDto.destinationName,
        destinationAddress: createDto.destinationAddress,
        destinationCity: createDto.destinationCity,
        destinationState: createDto.destinationState,
        destinationPostalCode: createDto.destinationPostalCode,
        destinationCountry: createDto.destinationCountry,
        shippedDate: createDto.shippedDate ? new Date(createDto.shippedDate) : undefined,
        receivedDate: createDto.receivedDate ? new Date(createDto.receivedDate) : undefined,
        inspectedDate: createDto.inspectedDate ? new Date(createDto.inspectedDate) : undefined,
        processedDate: createDto.processedDate ? new Date(createDto.processedDate) : undefined,
        estimatedDeliveryDate: createDto.estimatedDeliveryDate ? new Date(createDto.estimatedDeliveryDate) : undefined,
        notes: createDto.notes,
      },
      include: {
        rma: {
          include: {
            order: {
              include: {
                customer: true,
              },
            },
            product: true,
          },
        },
      },
    });
  }

  async findAll(skip = 0, take = 10, rmaId?: number, status?: string) {
    const where: any = {};
    if (rmaId) {
      where.rmaId = rmaId;
    }
    if (status && status !== 'all') {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      this.prisma.reverseLogistics.findMany({
        skip: Number(skip),
        take: Number(take),
        where,
        include: {
          rma: {
            include: {
              order: {
                include: {
                  customer: true,
                },
              },
              product: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.reverseLogistics.count({ where }),
    ]);

    return { data, total, skip, take };
  }

  async findOne(id: string) {
    const reverseLogistics = await this.prisma.reverseLogistics.findUnique({
      where: { id },
      include: {
        rma: {
          include: {
            order: {
              include: {
                customer: true,
              },
            },
            product: true,
          },
        },
      },
    });
    if (!reverseLogistics) {
      throw new NotFoundException(`Reverse logistics with ID ${id} not found`);
    }
    return reverseLogistics;
  }

  async update(id: string, updateDto: UpdateReverseLogisticsDto) {
    await this.findOne(id);
    
    return this.prisma.reverseLogistics.update({
      where: { id },
      data: {
        ...updateDto,
        ...(updateDto.shippedDate && { shippedDate: new Date(updateDto.shippedDate) }),
        ...(updateDto.receivedDate && { receivedDate: new Date(updateDto.receivedDate) }),
        ...(updateDto.inspectedDate && { inspectedDate: new Date(updateDto.inspectedDate) }),
        ...(updateDto.processedDate && { processedDate: new Date(updateDto.processedDate) }),
        ...(updateDto.estimatedDeliveryDate && { estimatedDeliveryDate: new Date(updateDto.estimatedDeliveryDate) }),
      },
      include: {
        rma: {
          include: {
            order: {
              include: {
                customer: true,
              },
            },
            product: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.reverseLogistics.delete({
      where: { id },
    });
  }
}

