import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExceptionDto } from './dto/create-exception.dto';
import { UpdateExceptionDto } from './dto/update-exception.dto';

@Injectable()
export class ExceptionsService {
  constructor(private prisma: PrismaService) {}

  async create(createExceptionDto: CreateExceptionDto) {
    const exception = await this.prisma.exception.create({
      data: createExceptionDto,
    });

    return exception;
  }

  async findAll(skip?: number, take?: number, type?: string, status?: string) {
    const where: any = {};
    if (type) {
      where.type = type;
    }
    if (status) {
      where.status = status;
    }

    const exceptions = await this.prisma.exception.findMany({
      skip,
      take,
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return exceptions;
  }

  async findOne(id: number) {
    const exception = await this.prisma.exception.findUnique({
      where: { id },
    });

    if (!exception) {
      throw new NotFoundException(`Exception with ID ${id} not found`);
    }

    return exception;
  }

  async update(id: number, updateExceptionDto: UpdateExceptionDto) {
    const existingException = await this.findOne(id);

    const updateData: any = { ...updateExceptionDto };

    // Auto-set resolvedAt when status changes to RESOLVED
    if (updateExceptionDto.status === 'RESOLVED' && existingException.status !== 'RESOLVED' && !existingException.resolvedAt) {
      updateData.resolvedAt = new Date();
    }

    const exception = await this.prisma.exception.update({
      where: { id },
      data: updateData,
    });

    return exception;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.exception.delete({
      where: { id },
    });
    return { message: 'Exception deleted successfully' };
  }
}

