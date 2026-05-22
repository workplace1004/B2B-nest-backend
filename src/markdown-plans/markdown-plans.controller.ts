import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MarkdownPlansService } from './markdown-plans.service';
import { CreateMarkdownPlanDto } from './dto/create-markdown-plan.dto';
import { UpdateMarkdownPlanDto } from './dto/update-markdown-plan.dto';
@Controller('markdown-plans')
export class MarkdownPlansController {
  constructor(private readonly markdownPlansService: MarkdownPlansService) {}

  @Post()
  create(@Body() createMarkdownPlanDto: CreateMarkdownPlanDto) {
    try {
      return this.markdownPlansService.create(createMarkdownPlanDto);
    } catch (error) {
      console.error('Error in MarkdownPlansController.create:', error);
      throw error;
    }
  }

  @Get()
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    try {
      return this.markdownPlansService.findAll(skip ? +skip : undefined, take ? +take : undefined);
    } catch (error) {
      console.error('Error in MarkdownPlansController.findAll:', error);
      throw error;
    }
  }

  @Get('product/:productId')
  findByProductId(@Param('productId') productId: string) {
    try {
      return this.markdownPlansService.findByProductId(+productId);
    } catch (error) {
      console.error('Error in MarkdownPlansController.findByProductId:', error);
      throw error;
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.markdownPlansService.findOne(+id);
    } catch (error) {
      console.error('Error in MarkdownPlansController.findOne:', error);
      throw error;
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarkdownPlanDto: UpdateMarkdownPlanDto) {
    try {
      return this.markdownPlansService.update(+id, updateMarkdownPlanDto);
    } catch (error) {
      console.error('Error in MarkdownPlansController.update:', error);
      throw error;
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.markdownPlansService.remove(+id);
    } catch (error) {
      console.error('Error in MarkdownPlansController.remove:', error);
      throw error;
    }
  }
}

