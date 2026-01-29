import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateForecastDto } from './dto/create-forecast.dto';

@Injectable()
export class ForecastService {
  constructor(private prisma: PrismaService) {}

  async create(createForecastDto: CreateForecastDto) {
    return this.prisma.forecast.create({
      data: createForecastDto,
      include: {
        product: true,
      },
    });
  }

  async findAll(productId?: number, period?: string) {
    const where: any = {};
    if (productId) where.productId = productId;
    if (period) where.period = period;

    return this.prisma.forecast.findMany({
      where,
      include: {
        product: true,
      },
      orderBy: { period: 'desc' },
    });
  }

  async findOne(id: number) {
    const forecast = await this.prisma.forecast.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });
    if (!forecast) {
      throw new NotFoundException(`Forecast with ID ${id} not found`);
    }
    return forecast;
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.forecast.delete({
      where: { id },
    });
  }
}

