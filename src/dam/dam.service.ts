import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDAMAssetDto } from './dto/create-dam-asset.dto';
import { UpdateDAMAssetDto } from './dto/update-dam-asset.dto';

@Injectable()
export class DAMService {
  constructor(private prisma: PrismaService) {}

  async create(createDAMAssetDto: CreateDAMAssetDto) {
    return this.prisma.dAMAsset.create({
      data: createDAMAssetDto,
      include: {
        product: true,
      },
    });
  }

  async findAll(productId?: number) {
    const where = productId ? { productId } : {};
    return this.prisma.dAMAsset.findMany({
      where,
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const asset = await this.prisma.dAMAsset.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });
    if (!asset) {
      throw new NotFoundException(`DAM Asset with ID ${id} not found`);
    }
    return asset;
  }

  async update(id: number, updateDAMAssetDto: UpdateDAMAssetDto) {
    await this.findOne(id);
    return this.prisma.dAMAsset.update({
      where: { id },
      data: updateDAMAssetDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.dAMAsset.delete({
      where: { id },
    });
  }
}

