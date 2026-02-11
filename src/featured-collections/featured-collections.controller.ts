import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { FeaturedCollectionsService } from './featured-collections.service';
import { CreateFeaturedCollectionDto } from './dto/create-featured-collection.dto';
import { UpdateFeaturedCollectionDto } from './dto/update-featured-collection.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('featured-collections')
@UseGuards(JwtAuthGuard)
export class FeaturedCollectionsController {
  constructor(private readonly featuredCollectionsService: FeaturedCollectionsService) {}

  @Post()
  create(@Body() createFeaturedCollectionDto: CreateFeaturedCollectionDto) {
    try {
      return this.featuredCollectionsService.create(createFeaturedCollectionDto);
    } catch (error) {
      console.error('Error in FeaturedCollectionsController.create:', error);
      throw error;
    }
  }

  @Get()
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    try {
      return this.featuredCollectionsService.findAll(skip ? +skip : undefined, take ? +take : undefined);
    } catch (error) {
      console.error('Error in FeaturedCollectionsController.findAll:', error);
      throw error;
    }
  }

  @Get('collection/:collectionId')
  findByCollectionId(@Param('collectionId') collectionId: string) {
    try {
      return this.featuredCollectionsService.findByCollectionId(+collectionId);
    } catch (error) {
      console.error('Error in FeaturedCollectionsController.findByCollectionId:', error);
      throw error;
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.featuredCollectionsService.findOne(+id);
    } catch (error) {
      console.error('Error in FeaturedCollectionsController.findOne:', error);
      throw error;
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFeaturedCollectionDto: UpdateFeaturedCollectionDto) {
    try {
      return this.featuredCollectionsService.update(+id, updateFeaturedCollectionDto);
    } catch (error) {
      console.error('Error in FeaturedCollectionsController.update:', error);
      throw error;
    }
  }

  @Delete('collection/:collectionId')
  removeByCollectionId(@Param('collectionId') collectionId: string) {
    try {
      return this.featuredCollectionsService.removeByCollectionId(+collectionId);
    } catch (error) {
      console.error('Error in FeaturedCollectionsController.removeByCollectionId:', error);
      throw error;
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.featuredCollectionsService.remove(+id);
    } catch (error) {
      console.error('Error in FeaturedCollectionsController.remove:', error);
      throw error;
    }
  }
}

