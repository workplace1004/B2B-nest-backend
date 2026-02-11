import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNumberingRuleDto } from './dto/create-numbering-rule.dto';
import { UpdateNumberingRuleDto } from './dto/update-numbering-rule.dto';

@Injectable()
export class NumberingRulesService {
  constructor(private prisma: PrismaService) {}

  async create(createNumberingRuleDto: CreateNumberingRuleDto) {
    const numberingRule = await this.prisma.numberingRule.create({
      data: {
        ...createNumberingRuleDto,
        length: createNumberingRuleDto.length || 8,
        sequenceStart: createNumberingRuleDto.sequenceStart || 1,
        currentSequence: createNumberingRuleDto.sequenceStart || 1,
        status: createNumberingRuleDto.status || 'ACTIVE',
      },
    });

    return this.mapNumberingRule(numberingRule);
  }

  async findAll(skip?: number, take?: number, type?: string, status?: string) {
    const where: any = {};
    if (type && type !== 'all') {
      where.type = type.toUpperCase();
    }
    if (status && status !== 'all') {
      where.status = status.toUpperCase() as any;
    }

    const [data, total] = await Promise.all([
      this.prisma.numberingRule.findMany({
        skip: skip,
        take: take,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.numberingRule.count({ where }),
    ]);

    const rules = data.map((rule) => this.mapNumberingRule(rule));

    return {
      data: rules,
      total,
      skip: skip || 0,
      take: take || rules.length,
    };
  }

  async findOne(id: number) {
    const numberingRule = await this.prisma.numberingRule.findUnique({
      where: { id },
    });

    if (!numberingRule) {
      throw new NotFoundException(`Numbering rule with ID ${id} not found`);
    }

    return this.mapNumberingRule(numberingRule);
  }

  async update(id: number, updateNumberingRuleDto: UpdateNumberingRuleDto) {
    const numberingRule = await this.findOne(id);

    const updated = await this.prisma.numberingRule.update({
      where: { id },
      data: updateNumberingRuleDto,
    });

    return this.mapNumberingRule(updated);
  }

  async remove(id: number) {
    // Get the raw Prisma object before deletion
    const numberingRule = await this.prisma.numberingRule.findUnique({
      where: { id },
    });

    if (!numberingRule) {
      throw new NotFoundException(`Numbering rule with ID ${id} not found`);
    }

    try {
      await this.prisma.numberingRule.delete({
        where: { id },
      });

      return this.mapNumberingRule(numberingRule);
    } catch (error: any) {
      // Handle foreign key constraint errors
      if (error.code === 'P2003') {
        throw new NotFoundException(
          `Cannot delete numbering rule: It is being used by other records. Please remove all references first.`
        );
      }
      // Handle record not found errors
      if (error.code === 'P2025') {
        throw new NotFoundException(`Numbering rule with ID ${id} not found`);
      }
      // Re-throw other errors
      throw error;
    }
  }

  async incrementSequence(id: number) {
    const numberingRule = await this.findOne(id);
    
    const updated = await this.prisma.numberingRule.update({
      where: { id },
      data: {
        currentSequence: numberingRule.currentSequence + 1,
      },
    });

    return this.mapNumberingRule(updated);
  }

  private mapNumberingRule(rule: any) {
    return {
      id: rule.id,
      name: rule.name,
      type: rule.type?.toLowerCase() || 'sku',
      prefix: rule.prefix,
      suffix: rule.suffix,
      length: rule.length,
      sequenceStart: rule.sequenceStart,
      currentSequence: rule.currentSequence,
      format: rule.format,
      status: rule.status?.toLowerCase() || 'active',
      description: rule.description,
      createdAt: rule.createdAt?.toISOString(),
      updatedAt: rule.updatedAt?.toISOString(),
    };
  }
}

