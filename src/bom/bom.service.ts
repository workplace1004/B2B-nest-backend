import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBOMDto } from './dto/create-bom.dto';
import { UpdateBOMDto } from './dto/update-bom.dto';

@Injectable()
export class BOMService {
  constructor(private prisma: PrismaService) {}

  async create(productId: number, createBOMDto: CreateBOMDto) {
    const { components, ...bomData } = createBOMDto;

    const bom = await this.prisma.bOM.create({
      data: {
        ...bomData,
        productId,
        components: {
          create: components.map((comp) => ({
            name: comp.name,
            productId: productId, // Use the BOM's productId for each component
            quantity: comp.quantity || 1,
            unit: comp.unit || 'pcs',
            cost: comp.cost || 0,
            notes: comp.notes || undefined,
          })),
        },
      },
      include: {
        components: {
          include: {
            product: true,
          },
        },
        product: true,
      },
    });

    return bom;
  }

  async findAll(skip?: number, take?: number) {
    const boms = await this.prisma.bOM.findMany({
      skip,
      take,
      include: {
        components: {
          include: {
            product: true,
          },
        },
        product: {
          include: {
            collection: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return boms;
  }

  async findOne(id: number) {
    const bom = await this.prisma.bOM.findUnique({
      where: { id },
      include: {
        components: {
          include: {
            product: true,
          },
        },
        product: {
          include: {
            collection: true,
          },
        },
      },
    });

    if (!bom) {
      throw new NotFoundException(`BOM with ID ${id} not found`);
    }

    return bom;
  }

  async findByProduct(productId: number) {
    const bom = await this.prisma.bOM.findUnique({
      where: { productId },
      include: {
        components: {
          include: {
            product: true,
          },
        },
        product: true,
      },
    });

    return bom;
  }

  async update(id: number, updateBOMDto: UpdateBOMDto) {
    try {
      const { components, ...bomData } = updateBOMDto;

      console.log('BOM Service Update:', { id, bomData, componentsCount: components?.length });

      // Check if BOM exists and get its productId
      const existingBOM = await this.findOne(id);
      const bomProductId = existingBOM.productId;

      // Prepare update data
      const updateData: any = {
        ...bomData,
      };

      // Only update components if provided
      if (components && Array.isArray(components) && components.length > 0) {
        updateData.components = {
          deleteMany: {},
          create: components.map((comp) => {
            const componentData: any = {
              name: comp.name,
              productId: bomProductId, // Use the BOM's productId for each component
              quantity: comp.quantity || 1,
              unit: comp.unit || 'pcs',
              cost: comp.cost || 0,
            };
            
            // Only include notes if it's not empty
            if (comp.notes && comp.notes.trim()) {
              componentData.notes = comp.notes.trim();
            }
            
            return componentData;
          }),
        };
      }

      console.log('BOM Update Data:', JSON.stringify(updateData, null, 2));

      const bom = await this.prisma.bOM.update({
        where: { id },
        data: updateData,
        include: {
          components: {
            include: {
              product: true,
            },
          },
          product: true,
        },
      });

      console.log('BOM Updated Successfully:', bom.id);
      return bom;
    } catch (error) {
      console.error('BOM Update Error:', error);
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.bOM.delete({
      where: { id },
    });
    return { message: 'BOM deleted successfully' };
  }
}

