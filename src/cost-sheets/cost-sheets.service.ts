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
    try {
      console.log('Cost Sheet Service Update:', { id, updateCostSheetDto });
      
      await this.findOne(id);
      
      const { materials, labor, overhead, sellingPrice, notes } = updateCostSheetDto;
      const totalCost = (parseFloat(materials?.toString() || '0') || 0) + 
                        (parseFloat(labor?.toString() || '0') || 0) + 
                        (parseFloat(overhead?.toString() || '0') || 0);
      
      let margin = null;
      if (sellingPrice && parseFloat(sellingPrice.toString()) > 0) {
        margin = ((parseFloat(sellingPrice.toString()) - totalCost) / parseFloat(sellingPrice.toString())) * 100;
      }

      const updateData: any = {
        totalCost,
      };

      // Only include fields that are provided
      if (materials !== undefined) {
        updateData.materials = Number(materials) || 0;
      }
      if (labor !== undefined) {
        updateData.labor = Number(labor) || 0;
      }
      if (overhead !== undefined) {
        updateData.overhead = Number(overhead) || 0;
      }
      if (sellingPrice !== undefined && sellingPrice !== null) {
        updateData.sellingPrice = Number(sellingPrice);
        if (margin !== null) {
          updateData.margin = margin;
        }
      }
      if (notes !== undefined && notes !== null && notes.trim()) {
        updateData.notes = notes.trim();
      }

      console.log('Cost Sheet Update Data:', JSON.stringify(updateData, null, 2));

      const costSheet = await this.prisma.costSheet.update({
        where: { id },
        data: updateData,
        include: {
          product: true,
        },
      });

      console.log('Cost Sheet Updated Successfully:', costSheet.id);
      return costSheet;
    } catch (error) {
      console.error('Cost Sheet Update Error:', error);
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.costSheet.delete({
      where: { id },
    });
  }
}

