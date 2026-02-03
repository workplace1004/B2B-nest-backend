import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComplianceEvidenceDto } from './dto/create-compliance-evidence.dto';
import { UpdateComplianceEvidenceDto } from './dto/update-compliance-evidence.dto';

@Injectable()
export class ComplianceEvidenceService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateComplianceEvidenceDto) {
    const { issueDate, expiryDate, ...data } = createDto;
    
    return this.prisma.complianceEvidence.create({
      data: {
        ...data,
        issueDate: issueDate ? new Date(issueDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
      },
      include: {
        product: true,
      },
    });
  }

  async findAll(productId?: number) {
    const where = productId ? { productId } : {};
    return this.prisma.complianceEvidence.findMany({
      where,
      include: {
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const evidence = await this.prisma.complianceEvidence.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });
    if (!evidence) {
      throw new NotFoundException(`Compliance Evidence with ID ${id} not found`);
    }
    return evidence;
  }

  async update(id: number, updateDto: UpdateComplianceEvidenceDto) {
    await this.findOne(id);
    
    const { issueDate, expiryDate, ...data } = updateDto;
    const updateData: any = { ...data };
    
    if (issueDate !== undefined) {
      updateData.issueDate = issueDate ? new Date(issueDate) : null;
    }
    if (expiryDate !== undefined) {
      updateData.expiryDate = expiryDate ? new Date(expiryDate) : null;
    }

    return this.prisma.complianceEvidence.update({
      where: { id },
      data: updateData,
      include: {
        product: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.complianceEvidence.delete({
      where: { id },
    });
  }
}

