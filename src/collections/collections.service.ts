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

  async findAll() {
    return this.prisma.collection.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
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

