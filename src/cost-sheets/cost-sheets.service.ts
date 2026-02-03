import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCostSheetDto } from './dto/create-cost-sheet.dto';
import { UpdateCostSheetDto } from './dto/update-cost-sheet.dto';

@Injectable()
export class CostSheetsService {
  constructor(private prisma: PrismaService) {}

  async create(productId: number, createCostSheetDto: CreateCostSheetDto) {
    const { materials, labor, overhead, sellingPrice, notes } = createCostSheetDto;
    const totalCost = (parseFloat(materials.toString()) || 0) + 
                      (parseFloat(labor.toString()) || 0) + 
                      (parseFloat(overhead.toString()) || 0);
    
    let margin = null;
    if (sellingPrice && parseFloat(sellingPrice.toString()) > 0) {
      margin = ((parseFloat(sellingPrice.toString()) - totalCost) / parseFloat(sellingPrice.toString())) * 100;
    }

    return this.prisma.costSheet.create({
      data: {
        productId,
        materials: materials || 0,
        labor: labor || 0,
        overhead: overhead || 0,
        totalCost,
        sellingPrice: sellingPrice || null,
        margin: margin !== null ? margin : null,
        notes: notes || null,
      },
      include: {
        product: true,
      },
    });
  }

  async findAll(skip?: number, take?: number) {
    if (skip === undefined && take === undefined) {
      const data = await this.prisma.costSheet.findMany({
        include: {
          product: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      return data;
    }

    const skipValue = skip !== undefined && skip >= 0 ? skip : 0;
    const takeValue = take !== undefined && take > 0 ? take : 10;

    const [data, total] = await Promise.all([
      this.prisma.costSheet.findMany({
        skip: skipValue,
        take: takeValue,
        include: {
          product: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.costSheet.count(),
    ]);

    return {
      data,
      total,
      skip: skipValue,
      take: takeValue,
    };
  }

  async findOne(id: number) {
    const costSheet = await this.prisma.costSheet.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });
    if (!costSheet) {
      throw new NotFoundException(`Cost sheet with ID ${id} not found`);
    }
    return costSheet;
  }

  async findByProduct(productId: number) {
    return this.prisma.costSheet.findUnique({
      where: { productId },
      include: {
        product: true,
      },
    });
  }

  async update(id: number, updateCostSheetDto: UpdateCostSheetDto) {
    await this.findOne(id);
    
    const { materials, labor, overhead, sellingPrice, notes } = updateCostSheetDto;
    const totalCost = (parseFloat(materials?.toString() || '0') || 0) + 
                      (parseFloat(labor?.toString() || '0') || 0) + 
                      (parseFloat(overhead?.toString() || '0') || 0);
    
    let margin = null;
    if (sellingPrice && parseFloat(sellingPrice.toString()) > 0) {
      margin = ((parseFloat(sellingPrice.toString()) - totalCost) / parseFloat(sellingPrice.toString())) * 100;
    }

    return this.prisma.costSheet.update({
      where: { id },
      data: {
        materials: materials !== undefined ? materials : undefined,
        labor: labor !== undefined ? labor : undefined,
        overhead: overhead !== undefined ? overhead : undefined,
        totalCost,
        sellingPrice: sellingPrice !== undefined ? sellingPrice : undefined,
        margin: margin !== null ? margin : undefined,
        notes: notes !== undefined ? notes : undefined,
      },
      include: {
        product: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.costSheet.delete({
      where: { id },
    });
  }
}

