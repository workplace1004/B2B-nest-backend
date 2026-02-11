import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaxDefaultDto } from './dto/create-tax-default.dto';
import { UpdateTaxDefaultDto } from './dto/update-tax-default.dto';

@Injectable()
export class TaxDefaultsService {
  constructor(private prisma: PrismaService) {}

  async create(createTaxDefaultDto: CreateTaxDefaultDto) {
    // If this is set as default, unset other defaults
    if (createTaxDefaultDto.isDefault) {
      await this.prisma.taxDefault.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    const taxDefault = await this.prisma.taxDefault.create({
      data: createTaxDefaultDto,
    });

    return this.mapTaxDefault(taxDefault);
  }

  async findAll(skip?: number, take?: number, type?: string) {
    const where: any = {};
    if (type && type !== 'all') {
      where.type = type.toUpperCase().replace('-', '_') as any;
    }

    const [data, total] = await Promise.all([
      this.prisma.taxDefault.findMany({
        skip: skip,
        take: take,
        where,
        orderBy: { name: 'asc' },
      }),
      this.prisma.taxDefault.count({ where }),
    ]);

    const taxDefaults = data.map((tax) => this.mapTaxDefault(tax));

    return {
      data: taxDefaults,
      total,
      skip: skip || 0,
      take: take || taxDefaults.length,
    };
  }

  async findOne(id: number) {
    const taxDefault = await this.prisma.taxDefault.findUnique({
      where: { id },
    });

    if (!taxDefault) {
      throw new NotFoundException(`Tax default with ID ${id} not found`);
    }

    return this.mapTaxDefault(taxDefault);
  }

  async update(id: number, updateTaxDefaultDto: UpdateTaxDefaultDto) {
    const taxDefault = await this.findOne(id);

    // If this is being set as default, unset other defaults
    if (updateTaxDefaultDto.isDefault === true) {
      await this.prisma.taxDefault.updateMany({
        where: { isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const updated = await this.prisma.taxDefault.update({
      where: { id },
      data: updateTaxDefaultDto,
    });

    return this.mapTaxDefault(updated);
  }

  async remove(id: number) {
    const taxDefault = await this.findOne(id);
    
    try {
      await this.prisma.taxDefault.delete({
        where: { id },
      });

      return taxDefault; // findOne already returns a mapped object, no need to map again
    } catch (error: any) {
      // Handle foreign key constraint errors
      if (error.code === 'P2003') {
        throw new NotFoundException(
          `Cannot delete tax default: It is being used by other records. Please remove all references first.`
        );
      }
      // Handle record not found errors
      if (error.code === 'P2025') {
        throw new NotFoundException(`Tax default with ID ${id} not found`);
      }
      // Re-throw other errors
      throw error;
    }
  }

  private mapTaxDefault(tax: any) {
    return {
      id: tax.id,
      name: tax.name,
      type: tax.type?.toLowerCase().replace('_', '-') || 'vat',
      taxRate: tax.taxRate !== null && tax.taxRate !== undefined ? Number(tax.taxRate) : null,
      vatRate: tax.vatRate !== null && tax.vatRate !== undefined ? Number(tax.vatRate) : null,
      country: tax.country,
      region: tax.region,
      isDefault: tax.isDefault,
      description: tax.description,
      createdAt: tax.createdAt?.toISOString(),
      updatedAt: tax.updatedAt?.toISOString(),
    };
  }
}

