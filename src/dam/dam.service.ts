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

  async findAll(productId?: number, skip?: number, take?: number) {
    const where = productId ? { productId } : {};
    
    // Get total count
    const total = await this.prisma.dAMAsset.count({ where });
    
    // Get paginated data
    const data = await this.prisma.dAMAsset.findMany({
      where,
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: skip,
      take: take,
    });
    
    return {
      data,
      total,
      skip: skip || 0,
      take: take || data.length,
    };
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
    try {
      console.log('DAM Service Update:', { id, updateDAMAssetDto });
      
      await this.findOne(id);
      
      // Clean the update data - only include fields that are provided and not empty
      const updateData: any = {};
      
      if (updateDAMAssetDto.name !== undefined) {
        updateData.name = updateDAMAssetDto.name.trim();
      }
      
      if (updateDAMAssetDto.description !== undefined) {
        updateData.description = updateDAMAssetDto.description?.trim() || null;
      }
      
      if (updateDAMAssetDto.tags !== undefined) {
        // Only update tags if provided and not empty, otherwise keep existing tags
        if (updateDAMAssetDto.tags && updateDAMAssetDto.tags.length > 0) {
          updateData.tags = updateDAMAssetDto.tags;
        } else if (updateDAMAssetDto.tags && updateDAMAssetDto.tags.length === 0) {
          // Explicitly set to empty array if empty array is provided
          updateData.tags = [];
        }
        // If tags is undefined, don't include it in updateData (keeps existing tags)
      }
      
      if (updateDAMAssetDto.url !== undefined) {
        updateData.url = updateDAMAssetDto.url;
      }
      
      if (updateDAMAssetDto.thumbnailUrl !== undefined) {
        updateData.thumbnailUrl = updateDAMAssetDto.thumbnailUrl || null;
      }
      
      console.log('DAM Update Data:', JSON.stringify(updateData, null, 2));
      
      const updatedAsset = await this.prisma.dAMAsset.update({
        where: { id },
        data: updateData,
        include: {
          product: true,
        },
      });
      
      console.log('DAM Asset Updated Successfully:', updatedAsset.id);
      return updatedAsset;
    } catch (error) {
      console.error('DAM Update Error:', error);
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.dAMAsset.delete({
      where: { id },
    });
  }
}

