import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReplenishmentDto } from './dto/create-replenishment.dto';
import { UpdateReplenishmentDto } from './dto/update-replenishment.dto';

@Injectable()
export class ReplenishmentService {
  constructor(private prisma: PrismaService) {}

  async create(createReplenishmentDto: CreateReplenishmentDto) {
    const replenishment = await this.prisma.replenishment.create({
      data: createReplenishmentDto,
      include: {
        product: true,
        warehouse: true,
      },
    });

    return replenishment;
  }

  async findAll(skip?: number, take?: number, productId?: number, warehouseId?: number, status?: string) {
    const where: any = {};
    if (productId) {
      where.productId = productId;
    }
    if (warehouseId) {
      where.warehouseId = warehouseId;
    }
    if (status) {
      where.status = status;
    }

    const replenishments = await this.prisma.replenishment.findMany({
      skip,
      take,
      where,
      include: {
        product: true,
        warehouse: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return replenishments;
  }

  async findOne(id: number) {
    const replenishment = await this.prisma.replenishment.findUnique({
      where: { id },
      include: {
        product: true,
        warehouse: true,
      },
    });

    if (!replenishment) {
      throw new NotFoundException(`Replenishment with ID ${id} not found`);
    }

    return replenishment;
  }

  async update(id: number, updateReplenishmentDto: UpdateReplenishmentDto) {
    const existingReplenishment = await this.findOne(id);

    const updateData: any = { ...updateReplenishmentDto };

    // Auto-set completedDate when status changes to COMPLETED
    if (updateReplenishmentDto.status === 'COMPLETED' && existingReplenishment.status !== 'COMPLETED' && !existingReplenishment.completedDate) {
      updateData.completedDate = new Date();
    }

    const replenishment = await this.prisma.replenishment.update({
      where: { id },
      data: updateData,
      include: {
        product: true,
        warehouse: true,
      },
    });

    return replenishment;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.replenishment.delete({
      where: { id },
    });
    return { message: 'Replenishment deleted successfully' };
  }
}

