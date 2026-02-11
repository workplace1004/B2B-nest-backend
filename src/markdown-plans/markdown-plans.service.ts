import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMarkdownPlanDto } from './dto/create-markdown-plan.dto';
import { UpdateMarkdownPlanDto } from './dto/update-markdown-plan.dto';

@Injectable()
export class MarkdownPlansService {
  constructor(private prisma: PrismaService) {}

  async create(createMarkdownPlanDto: CreateMarkdownPlanDto) {
    try {
      // Check if product exists
      const product = await this.prisma.product.findUnique({
        where: { id: createMarkdownPlanDto.productId },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${createMarkdownPlanDto.productId} not found`);
      }

      const markdownPlan = await this.prisma.markdownPlan.create({
        data: {
          ...createMarkdownPlanDto,
          startDate: new Date(createMarkdownPlanDto.startDate),
          endDate: createMarkdownPlanDto.endDate ? new Date(createMarkdownPlanDto.endDate) : null,
        },
        include: {
          product: true,
        },
      });

      return markdownPlan;
    } catch (error) {
      console.error('Error in MarkdownPlansService.create:', error);
      throw error;
    }
  }

  async findAll(skip?: number, take?: number) {
    try {
      const markdownPlans = await this.prisma.markdownPlan.findMany({
        skip,
        take,
        include: {
          product: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return markdownPlans;
    } catch (error) {
      console.error('Error in MarkdownPlansService.findAll:', error);
      throw error;
    }
  }

  async findByProductId(productId: number) {
    try {
      const markdownPlan = await this.prisma.markdownPlan.findFirst({
        where: { productId },
        include: {
          product: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return markdownPlan;
    } catch (error) {
      console.error('Error in MarkdownPlansService.findByProductId:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const markdownPlan = await this.prisma.markdownPlan.findUnique({
        where: { id },
        include: {
          product: true,
        },
      });

      if (!markdownPlan) {
        throw new NotFoundException(`Markdown plan with ID ${id} not found`);
      }

      return markdownPlan;
    } catch (error) {
      console.error('Error in MarkdownPlansService.findOne:', error);
      throw error;
    }
  }

  async update(id: number, updateMarkdownPlanDto: UpdateMarkdownPlanDto) {
    try {
      await this.findOne(id);

      const data: any = { ...updateMarkdownPlanDto };
      if (updateMarkdownPlanDto.startDate) {
        data.startDate = new Date(updateMarkdownPlanDto.startDate);
      }
      if (updateMarkdownPlanDto.endDate !== undefined) {
        data.endDate = updateMarkdownPlanDto.endDate ? new Date(updateMarkdownPlanDto.endDate) : null;
      }

      const markdownPlan = await this.prisma.markdownPlan.update({
        where: { id },
        data,
        include: {
          product: true,
        },
      });

      return markdownPlan;
    } catch (error) {
      console.error('Error in MarkdownPlansService.update:', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      await this.prisma.markdownPlan.delete({
        where: { id },
      });
      return { message: 'Markdown plan deleted successfully' };
    } catch (error) {
      console.error('Error in MarkdownPlansService.remove:', error);
      throw error;
    }
  }
}

