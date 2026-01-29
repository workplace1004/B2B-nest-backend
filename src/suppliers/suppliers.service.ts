import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async create(createSupplierDto: CreateSupplierDto) {
    return this.prisma.supplier.create({
      data: createSupplierDto,
    });
  }

  async findAll() {
    return this.prisma.supplier.findMany({
      include: {
        _count: {
          select: { purchaseOrders: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
      include: {
        purchaseOrders: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
    return supplier;
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto) {
    await this.findOne(id);
    return this.prisma.supplier.update({
      where: { id },
      data: updateSupplierDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.supplier.delete({
      where: { id },
    });
  }
}

