import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
      include: {
        collection: true,
        inventory: {
          include: {
            warehouse: true,
          },
        },
      },
    });
  }

  async findAll(skip = 0, take = 10, collectionId?: number) {
    const where = collectionId ? { collectionId } : {};
    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take,
        include: {
          collection: true,
          inventory: {
            include: {
              warehouse: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);
    return { data, total, skip, take };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        collection: true,
        inventory: {
          include: {
            warehouse: true,
          },
        },
        damAssets: true,
      },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async findBySku(sku: string) {
    return this.prisma.product.findUnique({
      where: { sku },
      include: {
        collection: true,
        inventory: true,
      },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        collection: true,
        inventory: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.product.delete({
      where: { id },
    });
  }
}

