import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: createCustomerDto,
    });
  }

  async findAll(skip = 0, take = 10, type?: string) {
    const where = type ? { type: type as any } : {};
    const [data, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take,
        include: {
          owner: true,
          _count: {
            select: { orders: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.customer.count({ where }),
    ]);
    return { data, total, skip, take };
  }

  async findOne(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        owner: true,
        orders: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    await this.findOne(id);
    return this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.customer.delete({
      where: { id },
    });
  }

  async checkEmailExists(email: string, excludeId?: number) {
    const where: any = { email };
    if (excludeId) {
      where.id = { not: excludeId };
    }
    const customer = await this.prisma.customer.findFirst({
      where,
    });
    return { exists: !!customer };
  }
}

