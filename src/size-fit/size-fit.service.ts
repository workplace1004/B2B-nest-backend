import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSizeChartDto } from './dto/create-size-chart.dto';
import { UpdateSizeChartDto } from './dto/update-size-chart.dto';

@Injectable()
export class SizeFitService {
  constructor(private prisma: PrismaService) {}

  async create(createSizeChartDto: CreateSizeChartDto) {
    return this.prisma.sizeChart.create({
      data: {
        ...createSizeChartDto,
        measurements: createSizeChartDto.measurements as any,
      },
    });
  }

  async findAll(skip = 0, take = 10, category?: string, search?: string) {
    const where: any = {};
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.sizeChart.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.sizeChart.count({ where }),
    ]);

    return {
      data,
      total,
      skip,
      take,
    };
  }

  async findOne(id: number) {
    const sizeChart = await this.prisma.sizeChart.findUnique({
      where: { id },
    });

    if (!sizeChart) {
      throw new NotFoundException(`Size chart with ID ${id} not found`);
    }

    return sizeChart;
  }

  async update(id: number, updateSizeChartDto: UpdateSizeChartDto) {
    const sizeChart = await this.findOne(id);

    return this.prisma.sizeChart.update({
      where: { id },
      data: {
        ...updateSizeChartDto,
        measurements: updateSizeChartDto.measurements
          ? (updateSizeChartDto.measurements as any)
          : undefined,
      },
    });
  }

  async remove(id: number) {
    const sizeChart = await this.findOne(id);
    await this.prisma.sizeChart.delete({
      where: { id },
    });
    return sizeChart;
  }
}

