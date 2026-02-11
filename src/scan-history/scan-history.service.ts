import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScanHistoryDto } from './dto/create-scan-history.dto';
import { UpdateScanHistoryDto } from './dto/update-scan-history.dto';

@Injectable()
export class ScanHistoryService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateScanHistoryDto) {
    return this.prisma.scanHistory.create({
      data: createDto,
      include: {
        product: true,
        warehouse: true,
      },
    });
  }

  async findAll(
    skip = 0,
    take = 10,
    warehouseId?: number,
    codeType?: string,
    action?: string,
  ) {
    const where: any = {};
    if (warehouseId) {
      where.warehouseId = warehouseId;
    }
    if (codeType && codeType !== 'all') {
      where.codeType = codeType;
    }
    if (action && action !== 'all') {
      where.action = action;
    }

    const [data, total] = await Promise.all([
      this.prisma.scanHistory.findMany({
        skip: Number(skip),
        take: Number(take),
        where,
        include: {
          product: true,
          warehouse: true,
        },
        orderBy: { scannedAt: 'desc' },
      }),
      this.prisma.scanHistory.count({ where }),
    ]);

    return { data, total, skip, take };
  }

  async findOne(id: string) {
    const scanHistory = await this.prisma.scanHistory.findUnique({
      where: { id },
      include: {
        product: true,
        warehouse: true,
      },
    });
    if (!scanHistory) {
      throw new NotFoundException(`Scan history with ID ${id} not found`);
    }
    return scanHistory;
  }

  async update(id: string, updateDto: UpdateScanHistoryDto) {
    await this.findOne(id);
    return this.prisma.scanHistory.update({
      where: { id },
      data: updateDto,
      include: {
        product: true,
        warehouse: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.scanHistory.delete({
      where: { id },
    });
  }

  async removeAll() {
    return this.prisma.scanHistory.deleteMany({});
  }
}

