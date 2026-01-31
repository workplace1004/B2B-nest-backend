import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(private prisma: PrismaService) {}

  async create(createCollectionDto: CreateCollectionDto) {
    return this.prisma.collection.create({
      data: createCollectionDto,
      include: {
        products: true,
      },
    });
  }

  async findAll(skip?: number, take?: number) {
    // If pagination params are not provided, return all data (backward compatibility)
    if (skip === undefined && take === undefined) {
      const data = await this.prisma.collection.findMany({
        include: {
          _count: {
            select: { products: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      return data;
    }

    // Paginated response - ensure take is a valid positive number
    const skipValue = skip !== undefined && skip >= 0 ? skip : 0;
    const takeValue = take !== undefined && take > 0 ? take : 10;

    const [data, total] = await Promise.all([
      this.prisma.collection.findMany({
        skip: skipValue,
        take: takeValue,
        include: {
          _count: {
            select: { products: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.collection.count(),
    ]);

    return {
      data,
      total,
      skip: skipValue,
      take: takeValue,
    };
  }

  async findOne(id: number) {
    const collection = await this.prisma.collection.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            inventory: true,
          },
        },
      },
    });
    if (!collection) {
      throw new NotFoundException(`Collection with ID ${id} not found`);
    }
    return collection;
  }

  async update(id: number, updateCollectionDto: UpdateCollectionDto) {
    await this.findOne(id);
    return this.prisma.collection.update({
      where: { id },
      data: updateCollectionDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.collection.delete({
      where: { id },
    });
  }
}

