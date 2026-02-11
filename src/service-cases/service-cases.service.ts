import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceCaseDto } from './dto/create-service-case.dto';
import { UpdateServiceCaseDto } from './dto/update-service-case.dto';

@Injectable()
export class ServiceCasesService {
  constructor(private prisma: PrismaService) {}

  async create(createServiceCaseDto: CreateServiceCaseDto) {
    return this.prisma.serviceCase.create({
      data: {
        ...createServiceCaseDto,
        resolvedAt: createServiceCaseDto.status === 'RESOLVED' ? new Date() : null,
      },
      include: {
        customer: true,
      },
    });
  }

  async findAll(skip = 0, take = 10, status?: string, priority?: string, search?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (search) {
      where.OR = [
        { caseNumber: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.serviceCase.findMany({
        where,
        skip,
        take,
        include: {
          customer: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.serviceCase.count({ where }),
    ]);

    return {
      data,
      total,
      skip,
      take,
    };
  }

  async findOne(id: number) {
    const serviceCase = await this.prisma.serviceCase.findUnique({
      where: { id },
      include: {
        customer: true,
      },
    });

    if (!serviceCase) {
      throw new NotFoundException(`ServiceCase with ID ${id} not found`);
    }

    return serviceCase;
  }

  async update(id: number, updateServiceCaseDto: UpdateServiceCaseDto) {
    const serviceCase = await this.findOne(id);

    const updateData: any = { ...updateServiceCaseDto };
    
    // If status is being updated to RESOLVED, set resolvedAt
    if (updateServiceCaseDto.status === 'RESOLVED' && serviceCase.status !== 'RESOLVED') {
      updateData.resolvedAt = new Date();
    }
    // If status is being changed from RESOLVED, clear resolvedAt
    if (serviceCase.status === 'RESOLVED' && updateServiceCaseDto.status && updateServiceCaseDto.status !== 'RESOLVED') {
      updateData.resolvedAt = null;
    }

    return this.prisma.serviceCase.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
      },
    });
  }

  async remove(id: number) {
    const serviceCase = await this.findOne(id);
    await this.prisma.serviceCase.delete({
      where: { id },
    });
    return serviceCase;
  }
}

