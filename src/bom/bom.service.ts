import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBOMDto } from './dto/create-bom.dto';
import { UpdateBOMDto } from './dto/update-bom.dto';

@Injectable()
export class BOMService {
  constructor(private prisma: PrismaService) {}

  async create(productId: number, createBOMDto: CreateBOMDto) {
    const { components, ...bomData } = createBOMDto;

    const bom = await this.prisma.bOM.create({
      data: {
        ...bomData,
        productId,
        components: {
          create: components.map((comp) => ({
            name: comp.name,
            productId: comp.productId,
            quantity: comp.quantity || 1,
            unit: comp.unit || 'pcs',
            cost: comp.cost || 0,
            notes: comp.notes,
          })),
        },
      },
      include: {
        components: {
          include: {
            product: true,
          },
        },
        product: true,
      },
    });

    return bom;
  }

  async findAll(skip?: number, take?: number) {
    const boms = await this.prisma.bOM.findMany({
      skip,
      take,
      include: {
        components: {
          include: {
            product: true,
          },
        },
        product: {
          include: {
            collection: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return boms;
  }

  async findOne(id: number) {
    const bom = await this.prisma.bOM.findUnique({
      where: { id },
      include: {
        components: {
          include: {
            product: true,
          },
        },
        product: {
          include: {
            collection: true,
          },
        },
      },
    });

    if (!bom) {
      throw new NotFoundException(`BOM with ID ${id} not found`);
    }

    return bom;
  }

  async findByProduct(productId: number) {
    const bom = await this.prisma.bOM.findUnique({
      where: { productId },
      include: {
        components: {
          include: {
            product: true,
          },
        },
        product: true,
      },
    });

    return bom;
  }

  async update(id: number, updateBOMDto: UpdateBOMDto) {
    const { components, ...bomData } = updateBOMDto;

    // Check if BOM exists
    await this.findOne(id);

    const bom = await this.prisma.bOM.update({
      where: { id },
      data: {
        ...bomData,
        ...(components && {
          components: {
            deleteMany: {},
            create: components.map((comp) => ({
              name: comp.name,
              productId: comp.productId,
              quantity: comp.quantity || 1,
              unit: comp.unit || 'pcs',
              cost: comp.cost || 0,
              notes: comp.notes,
            })),
          },
        }),
      },
      include: {
        components: {
          include: {
            product: true,
          },
        },
        product: true,
      },
    });

    return bom;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.bOM.delete({
      where: { id },
    });
    return { message: 'BOM deleted successfully' };
  }
}

