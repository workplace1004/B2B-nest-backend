import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';

@Injectable()
export class ReturnsService {
  constructor(private prisma: PrismaService) {}

  async create(createReturnDto: CreateReturnDto) {
    const returnItem = await this.prisma.return.create({
      data: createReturnDto,
      include: {
        order: {
          include: {
            customer: true,
          },
        },
        product: true,
      },
    });

    return returnItem;
  }

  async findAll(skip?: number, take?: number, status?: string) {
    const where: any = {};
    if (status) {
      where.status = status;
    }

    const returns = await this.prisma.return.findMany({
      skip,
      take,
      where,
      include: {
        order: {
          include: {
            customer: true,
          },
        },
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return returns;
  }

  async findOne(id: number) {
    const returnItem = await this.prisma.return.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            customer: true,
            orderLines: true,
          },
        },
        product: true,
      },
    });

    if (!returnItem) {
      throw new NotFoundException(`Return with ID ${id} not found`);
    }

    return returnItem;
  }

  async update(id: number, updateReturnDto: UpdateReturnDto) {
    await this.findOne(id);

    const returnItem = await this.prisma.return.update({
      where: { id },
      data: updateReturnDto,
      include: {
        order: {
          include: {
            customer: true,
          },
        },
        product: true,
      },
    });

    return returnItem;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.return.delete({
      where: { id },
    });
    return { message: 'Return deleted successfully' };
  }
}

