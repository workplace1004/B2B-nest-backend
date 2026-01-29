import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async create(createInventoryDto: CreateInventoryDto) {
    const inventory = await this.prisma.inventory.create({
      data: {
        ...createInventoryDto,
        availableQty: createInventoryDto.quantity - (createInventoryDto.reservedQty || 0),
      },
      include: {
        product: true,
        warehouse: true,
      },
    });
    return inventory;
  }

  async findAll(warehouseId?: number, productId?: number) {
    const where: any = {};
    if (warehouseId) where.warehouseId = warehouseId;
    if (productId) where.productId = productId;

    return this.prisma.inventory.findMany({
      where,
      include: {
        product: {
          include: {
            collection: true,
          },
        },
        warehouse: true,
      },
    });
  }

  async findOne(id: number) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id },
      include: {
        product: true,
        warehouse: true,
      },
    });
    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }
    return inventory;
  }

  async update(id: number, updateInventoryDto: UpdateInventoryDto) {
    const existing = await this.findOne(id);
    const quantity = updateInventoryDto.quantity ?? existing.quantity;
    const reservedQty = updateInventoryDto.reservedQty ?? existing.reservedQty;
    
    const inventory = await this.prisma.inventory.update({
      where: { id },
      data: {
        ...updateInventoryDto,
        availableQty: quantity - reservedQty,
      },
      include: {
        product: true,
        warehouse: true,
      },
    });
    return inventory;
  }

  async adjustQuantity(id: number, adjustment: number) {
    const inventory = await this.findOne(id);
    const newQuantity = inventory.quantity + adjustment;
    return this.update(id, { quantity: newQuantity });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.inventory.delete({
      where: { id },
    });
  }
}

