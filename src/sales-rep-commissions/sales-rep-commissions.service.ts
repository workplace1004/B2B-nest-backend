import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSalesRepCommissionDto } from './dto/create-sales-rep-commission.dto';
import { UpdateSalesRepCommissionDto } from './dto/update-sales-rep-commission.dto';

@Injectable()
export class SalesRepCommissionsService {
  constructor(private prisma: PrismaService) {}

  async create(createSalesRepCommissionDto: CreateSalesRepCommissionDto) {
    return this.prisma.salesRepCommission.create({
      data: {
        userId: createSalesRepCommissionDto.userId,
        period: createSalesRepCommissionDto.period,
        type: createSalesRepCommissionDto.type,
        salesAmount: createSalesRepCommissionDto.salesAmount ? createSalesRepCommissionDto.salesAmount : 0,
        marginAmount: createSalesRepCommissionDto.marginAmount ? createSalesRepCommissionDto.marginAmount : 0,
        commissionRate: createSalesRepCommissionDto.commissionRate ? createSalesRepCommissionDto.commissionRate : 0,
        commissionAmount: createSalesRepCommissionDto.commissionAmount ? createSalesRepCommissionDto.commissionAmount : 0,
        status: createSalesRepCommissionDto.status,
        notes: createSalesRepCommissionDto.notes,
        calculatedAt: createSalesRepCommissionDto.calculatedAt ? new Date(createSalesRepCommissionDto.calculatedAt) : null,
        approvedAt: createSalesRepCommissionDto.approvedAt ? new Date(createSalesRepCommissionDto.approvedAt) : null,
        paidAt: createSalesRepCommissionDto.paidAt ? new Date(createSalesRepCommissionDto.paidAt) : null,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(skip: number, take: number, period?: string, type?: string, status?: string, search?: string) {
    const where: any = {};
    if (period) where.period = period;
    if (type) where.type = type;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.salesRepCommission.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.salesRepCommission.count({ where }),
    ]);

    return { data, total };
  }

  async findOne(id: number) {
    const commission = await this.prisma.salesRepCommission.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    if (!commission) {
      throw new NotFoundException(`SalesRepCommission with ID ${id} not found`);
    }
    return commission;
  }

  async update(id: number, updateSalesRepCommissionDto: UpdateSalesRepCommissionDto) {
    await this.findOne(id); // Check if exists
    return this.prisma.salesRepCommission.update({
      where: { id },
      data: updateSalesRepCommissionDto,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Check if exists
    return this.prisma.salesRepCommission.delete({
      where: { id },
    });
  }
}

