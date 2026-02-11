import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEndlessAisleProductDto } from './dto/create-endless-aisle-product.dto';
import { UpdateEndlessAisleProductDto } from './dto/update-endless-aisle-product.dto';

@Injectable()
export class EndlessAisleProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createEndlessAisleProductDto: CreateEndlessAisleProductDto) {
    const { availableAtWarehouses, ...productData } = createEndlessAisleProductDto;

    const endlessAisleProduct = await this.prisma.endlessAisleProduct.create({
      data: {
        ...productData,
        availableAtWarehouses: {
          create: availableAtWarehouses,
        },
      },
      include: {
        product: true,
        availableAtWarehouses: {
          include: {
            warehouse: true,
          },
        },
      },
    });

    return endlessAisleProduct;
  }

  async findAll(skip = 0, take = 10, search?: string, isAvailable?: boolean) {
    try {
      const where: any = {};
      if (search) {
        where.OR = [
          { product: { name: { contains: search, mode: 'insensitive' } } },
          { product: { sku: { contains: search, mode: 'insensitive' } } },
          { category: { contains: search, mode: 'insensitive' } },
          { collection: { contains: search, mode: 'insensitive' } },
        ];
      }
      if (isAvailable !== undefined) {
        where.isAvailable = isAvailable;
      }

      const [data, total] = await Promise.all([
        this.prisma.endlessAisleProduct.findMany({
          skip: Number(skip),
          take: Number(take),
          where,
          include: {
            product: true,
            availableAtWarehouses: {
              include: {
                warehouse: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.endlessAisleProduct.count({ where }),
      ]);

      return { data, total, skip, take };
    } catch (error) {
      console.error('Error in EndlessAisleProductsService.findAll:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    const endlessAisleProduct = await this.prisma.endlessAisleProduct.findUnique({
      where: { id },
      include: {
        product: true,
        availableAtWarehouses: {
          include: {
            warehouse: true,
          },
        },
      },
    });

    if (!endlessAisleProduct) {
      throw new NotFoundException(`Endless Aisle Product with ID ${id} not found`);
    }

    return endlessAisleProduct;
  }

  async update(id: number, updateEndlessAisleProductDto: UpdateEndlessAisleProductDto) {
    await this.findOne(id);

    const { availableAtWarehouses, ...updateData } = updateEndlessAisleProductDto;

    const updatePayload: any = { ...updateData };
    if (availableAtWarehouses) {
      // Delete existing warehouses and create new ones
      await this.prisma.endlessAisleWarehouse.deleteMany({
        where: { endlessAisleProductId: id },
      });
      updatePayload.availableAtWarehouses = {
        create: availableAtWarehouses,
      };
    }

    const endlessAisleProduct = await this.prisma.endlessAisleProduct.update({
      where: { id },
      data: updatePayload,
      include: {
        product: true,
        availableAtWarehouses: {
          include: {
            warehouse: true,
          },
        },
      },
    });

    return endlessAisleProduct;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.endlessAisleProduct.delete({
      where: { id },
    });
    return { message: 'Endless Aisle Product deleted successfully' };
  }
}

