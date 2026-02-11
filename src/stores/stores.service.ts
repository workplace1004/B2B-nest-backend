import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async create(createStoreDto: CreateStoreDto) {
    const store = await this.prisma.store.create({
      data: {
        ...createStoreDto,
        operatingHours: createStoreDto.operatingHours || {},
      },
    });

    return store;
  }

  async findAll(skip = 0, take = 10, search?: string, isActive?: boolean) {
    try {
      const where: any = {};
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
          { city: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
        ];
      }
      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      const [data, total] = await Promise.all([
        this.prisma.store.findMany({
          skip: Number(skip),
          take: Number(take),
          where,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.store.count({ where }),
      ]);

      return { data, total, skip, take };
    } catch (error) {
      console.error('Error in StoresService.findAll:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    const store = await this.prisma.store.findUnique({
      where: { id },
    });

    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }

    return store;
  }

  async update(id: number, updateStoreDto: UpdateStoreDto) {
    await this.findOne(id);

    const store = await this.prisma.store.update({
      where: { id },
      data: updateStoreDto,
    });

    return store;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.store.delete({
      where: { id },
    });
    return { message: 'Store deleted successfully' };
  }
}

