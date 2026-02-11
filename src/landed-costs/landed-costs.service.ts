import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLandedCostDto } from './dto/create-landed-cost.dto';
import { UpdateLandedCostDto } from './dto/update-landed-cost.dto';

@Injectable()
export class LandedCostsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateLandedCostDto) {
    return this.prisma.landedCost.create({
      data: {
        ...createDto,
        calculatedDate: createDto.calculatedDate ? new Date(createDto.calculatedDate) : new Date(),
      },
      include: {
        order: {
          include: {
            customer: true,
          },
        },
      },
    });
  }

  async findAll(orderId?: number) {
    const where = orderId ? { orderId } : {};
    return this.prisma.landedCost.findMany({
      where,
      include: {
        order: {
          include: {
            customer: true,
          },
        },
      },
      orderBy: { calculatedDate: 'desc' },
    });
  }

  async findOne(id: number) {
    const landedCost = await this.prisma.landedCost.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            customer: true,
          },
        },
      },
    });
    if (!landedCost) {
      throw new NotFoundException(`Landed cost with ID ${id} not found`);
    }
    return landedCost;
  }

  async findByOrderId(orderId: number) {
    return this.prisma.landedCost.findUnique({
      where: { orderId },
      include: {
        order: {
          include: {
            customer: true,
          },
        },
      },
    });
  }

  async update(id: number, updateDto: UpdateLandedCostDto) {
    await this.findOne(id);
    return this.prisma.landedCost.update({
      where: { id },
      data: {
        ...updateDto,
        ...(updateDto.calculatedDate && { calculatedDate: new Date(updateDto.calculatedDate) }),
      },
      include: {
        order: {
          include: {
            customer: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.landedCost.delete({
      where: { id },
    });
  }
}

