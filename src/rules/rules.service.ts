import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';

@Injectable()
export class RulesService {
  constructor(private prisma: PrismaService) {}

  async create(createRuleDto: CreateRuleDto) {
    const rule = await this.prisma.rule.create({
      data: createRuleDto,
    });

    return rule;
  }

  async findAll(skip?: number, take?: number, type?: string, status?: string) {
    const where: any = {};
    if (type) {
      where.type = type;
    }
    if (status) {
      where.status = status;
    }

    const rules = await this.prisma.rule.findMany({
      skip,
      take,
      where,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return rules;
  }

  async findOne(id: number) {
    const rule = await this.prisma.rule.findUnique({
      where: { id },
    });

    if (!rule) {
      throw new NotFoundException(`Rule with ID ${id} not found`);
    }

    return rule;
  }

  async update(id: number, updateRuleDto: UpdateRuleDto) {
    await this.findOne(id);

    const rule = await this.prisma.rule.update({
      where: { id },
      data: updateRuleDto,
    });

    return rule;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.rule.delete({
      where: { id },
    });
    return { message: 'Rule deleted successfully' };
  }
}

