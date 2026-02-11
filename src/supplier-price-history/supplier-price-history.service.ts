import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierPriceHistoryDto } from './dto/create-supplier-price-history.dto';
import { UpdateSupplierPriceHistoryDto } from './dto/update-supplier-price-history.dto';

@Injectable()
export class SupplierPriceHistoryService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateSupplierPriceHistoryDto) {
    return this.prisma.supplierPriceHistory.create({
      data: {
        ...createDto,
        date: new Date(createDto.date),
      },
    });
  }

  async findAll(supplierId?: number) {
    const where = supplierId ? { supplierId } : {};
    return this.prisma.supplierPriceHistory.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: number) {
    const priceHistory = await this.prisma.supplierPriceHistory.findUnique({
      where: { id },
    });
    if (!priceHistory) {
      throw new NotFoundException(`Price history with ID ${id} not found`);
    }
    return priceHistory;
  }

  async update(id: number, updateDto: UpdateSupplierPriceHistoryDto) {
    await this.findOne(id);
    return this.prisma.supplierPriceHistory.update({
      where: { id },
      data: {
        ...updateDto,
        ...(updateDto.date && { date: new Date(updateDto.date) }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.supplierPriceHistory.delete({
      where: { id },
    });
  }
}

