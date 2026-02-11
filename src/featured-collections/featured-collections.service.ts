import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeaturedCollectionDto } from './dto/create-featured-collection.dto';
import { UpdateFeaturedCollectionDto } from './dto/update-featured-collection.dto';

@Injectable()
export class FeaturedCollectionsService {
  constructor(private prisma: PrismaService) {}

  async create(createFeaturedCollectionDto: CreateFeaturedCollectionDto) {
    try {
      // Check if collection exists
      const collection = await this.prisma.collection.findUnique({
        where: { id: createFeaturedCollectionDto.collectionId },
      });

      if (!collection) {
        throw new NotFoundException(`Collection with ID ${createFeaturedCollectionDto.collectionId} not found`);
      }

      // Check if already featured
      const existing = await this.prisma.featuredCollection.findUnique({
        where: { collectionId: createFeaturedCollectionDto.collectionId },
      });

      if (existing) {
        throw new ConflictException('Collection is already featured');
      }

      const featuredCollection = await this.prisma.featuredCollection.create({
        data: createFeaturedCollectionDto,
        include: {
          collection: true,
        },
      });

      return featuredCollection;
    } catch (error) {
      console.error('Error in FeaturedCollectionsService.create:', error);
      throw error;
    }
  }

  async findAll(skip?: number, take?: number) {
    try {
      const featuredCollections = await this.prisma.featuredCollection.findMany({
        skip,
        take,
        include: {
          collection: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return featuredCollections;
    } catch (error) {
      console.error('Error in FeaturedCollectionsService.findAll:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const featuredCollection = await this.prisma.featuredCollection.findUnique({
        where: { id },
        include: {
          collection: true,
        },
      });

      if (!featuredCollection) {
        throw new NotFoundException(`Featured collection with ID ${id} not found`);
      }

      return featuredCollection;
    } catch (error) {
      console.error('Error in FeaturedCollectionsService.findOne:', error);
      throw error;
    }
  }

  async findByCollectionId(collectionId: number) {
    try {
      const featuredCollection = await this.prisma.featuredCollection.findUnique({
        where: { collectionId },
        include: {
          collection: true,
        },
      });

      return featuredCollection;
    } catch (error) {
      console.error('Error in FeaturedCollectionsService.findByCollectionId:', error);
      throw error;
    }
  }

  async update(id: number, updateFeaturedCollectionDto: UpdateFeaturedCollectionDto) {
    try {
      await this.findOne(id);

      const featuredCollection = await this.prisma.featuredCollection.update({
        where: { id },
        data: updateFeaturedCollectionDto,
        include: {
          collection: true,
        },
      });

      return featuredCollection;
    } catch (error) {
      console.error('Error in FeaturedCollectionsService.update:', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      await this.prisma.featuredCollection.delete({
        where: { id },
      });
      return { message: 'Featured collection removed successfully' };
    } catch (error) {
      console.error('Error in FeaturedCollectionsService.remove:', error);
      throw error;
    }
  }

  async removeByCollectionId(collectionId: number) {
    try {
      const featuredCollection = await this.prisma.featuredCollection.findUnique({
        where: { collectionId },
      });

      if (!featuredCollection) {
        throw new NotFoundException(`Featured collection for collection ID ${collectionId} not found`);
      }

      await this.prisma.featuredCollection.delete({
        where: { collectionId },
      });
      return { message: 'Featured collection removed successfully' };
    } catch (error) {
      console.error('Error in FeaturedCollectionsService.removeByCollectionId:', error);
      throw error;
    }
  }
}

