import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDigitalProductPassportDto } from './dto/create-digital-product-passport.dto';
import { UpdateDigitalProductPassportDto } from './dto/update-digital-product-passport.dto';

@Injectable()
export class DigitalProductPassportService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateDigitalProductPassportDto) {
    const { productId, materials, traceabilityData, ...data } = createDto;
    
    return this.prisma.digitalProductPassport.create({
      data: {
        ...data,
        productId,
        materials: materials ? JSON.parse(JSON.stringify(materials)) : null,
        traceabilityData: traceabilityData ? JSON.parse(JSON.stringify(traceabilityData)) : null,
        productionDate: data.productionDate ? new Date(data.productionDate) : null,
      },
      include: {
        product: true,
      },
    });
  }

  async findAll() {
    return this.prisma.digitalProductPassport.findMany({
      include: {
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByProduct(productId: number) {
    return this.prisma.digitalProductPassport.findUnique({
      where: { productId },
      include: {
        product: true,
      },
    });
  }

  async findOne(id: number) {
    const passport = await this.prisma.digitalProductPassport.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });
    if (!passport) {
      throw new NotFoundException(`Digital Product Passport with ID ${id} not found`);
    }
    return passport;
  }

  async update(id: number, updateDto: UpdateDigitalProductPassportDto) {
    await this.findOne(id);
    
    const { materials, traceabilityData, productionDate, ...data } = updateDto;
    const updateData: any = { ...data };
    
    if (materials !== undefined) {
      updateData.materials = JSON.parse(JSON.stringify(materials));
    }
    if (traceabilityData !== undefined) {
      updateData.traceabilityData = JSON.parse(JSON.stringify(traceabilityData));
    }
    if (productionDate !== undefined) {
      updateData.productionDate = productionDate ? new Date(productionDate) : null;
    }

    return this.prisma.digitalProductPassport.update({
      where: { id },
      data: updateData,
      include: {
        product: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.digitalProductPassport.delete({
      where: { id },
    });
  }
}






