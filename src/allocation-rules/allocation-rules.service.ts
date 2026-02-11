import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAllocationRuleDto } from './dto/create-allocation-rule.dto';
import { UpdateAllocationRuleDto } from './dto/update-allocation-rule.dto';

@Injectable()
export class AllocationRulesService {
  constructor(private prisma: PrismaService) {}

  async create(createAllocationRuleDto: CreateAllocationRuleDto) {
    return this.prisma.allocationRule.create({
      data: {
        name: createAllocationRuleDto.name,
        priority: createAllocationRuleDto.priority ?? 0,
        channel: createAllocationRuleDto.channel ?? 'ALL',
        customerId: createAllocationRuleDto.customerId,
        customerType: createAllocationRuleDto.customerType as any,
        warehouseId: createAllocationRuleDto.warehouseId,
        allocationMethod: createAllocationRuleDto.allocationMethod ?? 'FIFO',
        conditions: createAllocationRuleDto.conditions as any,
        isActive: createAllocationRuleDto.isActive ?? true,
      },
      include: {
        customer: true,
        warehouse: true,
      },
    });
  }

  async findAll(isActive?: boolean) {
    const where: any = {};
    if (isActive !== undefined) where.isActive = isActive;

    return this.prisma.allocationRule.findMany({
      where,
      include: {
        customer: true,
        warehouse: true,
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findOne(id: number) {
    const rule = await this.prisma.allocationRule.findUnique({
      where: { id },
      include: {
        customer: true,
        warehouse: true,
      },
    });

    if (!rule) {
      throw new NotFoundException(`Allocation rule with ID ${id} not found`);
    }

    return rule;
  }

  async update(id: number, updateAllocationRuleDto: UpdateAllocationRuleDto) {
    await this.findOne(id);

    return this.prisma.allocationRule.update({
      where: { id },
      data: {
        name: updateAllocationRuleDto.name,
        priority: updateAllocationRuleDto.priority,
        channel: updateAllocationRuleDto.channel,
        customerId: updateAllocationRuleDto.customerId,
        customerType: updateAllocationRuleDto.customerType as any,
        warehouseId: updateAllocationRuleDto.warehouseId,
        allocationMethod: updateAllocationRuleDto.allocationMethod,
        conditions: updateAllocationRuleDto.conditions as any,
        isActive: updateAllocationRuleDto.isActive,
      },
      include: {
        customer: true,
        warehouse: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.allocationRule.delete({
      where: { id },
    });
    return { message: 'Allocation rule deleted successfully' };
  }
}

