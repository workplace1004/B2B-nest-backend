import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskCategoryDto } from './dto/create-task-category.dto';
import { UpdateTaskCategoryDto } from './dto/update-task-category.dto';

@Injectable()
export class TaskCategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskCategoryDto: CreateTaskCategoryDto) {
    // Check if category with same name already exists
    const existing = await this.prisma.taskCategory.findUnique({
      where: { name: createTaskCategoryDto.name },
    });

    if (existing) {
      throw new BadRequestException('Category with this name already exists');
    }

    // If this is set as default, unset all other defaults
    if (createTaskCategoryDto.isDefault) {
      await this.prisma.taskCategory.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.taskCategory.create({
      data: createTaskCategoryDto,
    });
  }

  async findAll() {
    return this.prisma.taskCategory.findMany({
      orderBy: [
        { isDefault: 'desc' },
        { name: 'asc' },
      ],
    });
  }

  async getDefault() {
    const defaultCategory = await this.prisma.taskCategory.findFirst({
      where: { isDefault: true },
    });

    if (!defaultCategory) {
      // Return a default "Default" category if none exists
      return { name: 'Default', isDefault: true };
    }

    return defaultCategory;
  }

  async update(id: number, updateTaskCategoryDto: UpdateTaskCategoryDto) {
    const category = await this.prisma.taskCategory.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Task category with ID ${id} not found`);
    }

    // If name is being updated, check for duplicates
    if (updateTaskCategoryDto.name && updateTaskCategoryDto.name !== category.name) {
      const existing = await this.prisma.taskCategory.findUnique({
        where: { name: updateTaskCategoryDto.name },
      });

      if (existing) {
        throw new BadRequestException('Category with this name already exists');
      }
    }

    // If setting as default, unset all other defaults
    if (updateTaskCategoryDto.isDefault) {
      await this.prisma.taskCategory.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.taskCategory.update({
      where: { id },
      data: updateTaskCategoryDto,
    });
  }

  async setDefault(id: number) {
    const category = await this.prisma.taskCategory.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Task category with ID ${id} not found`);
    }

    // Unset all other defaults
    await this.prisma.taskCategory.updateMany({
      where: { isDefault: true },
      data: { isDefault: false },
    });

    // Set this category as default
    return this.prisma.taskCategory.update({
      where: { id },
      data: { isDefault: true },
    });
  }

  async remove(id: number) {
    const category = await this.prisma.taskCategory.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Task category with ID ${id} not found`);
    }

    // Check if any tasks are using this category
    const tasksWithCategory = await this.prisma.task.count({
      where: { category: category.name },
    });

    if (tasksWithCategory > 0) {
      throw new BadRequestException(
        `Cannot delete category. ${tasksWithCategory} task(s) are using this category.`,
      );
    }

    await this.prisma.taskCategory.delete({
      where: { id },
    });

    return category;
  }
}

