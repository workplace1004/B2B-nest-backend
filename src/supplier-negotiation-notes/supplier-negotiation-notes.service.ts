import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierNegotiationNoteDto } from './dto/create-supplier-negotiation-note.dto';
import { UpdateSupplierNegotiationNoteDto } from './dto/update-supplier-negotiation-note.dto';

@Injectable()
export class SupplierNegotiationNotesService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateSupplierNegotiationNoteDto) {
    return this.prisma.supplierNegotiationNote.create({
      data: {
        ...createDto,
        date: new Date(createDto.date),
      },
    });
  }

  async findAll(supplierId?: number) {
    const where = supplierId ? { supplierId } : {};
    return this.prisma.supplierNegotiationNote.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: number) {
    const note = await this.prisma.supplierNegotiationNote.findUnique({
      where: { id },
    });
    if (!note) {
      throw new NotFoundException(`Negotiation note with ID ${id} not found`);
    }
    return note;
  }

  async update(id: number, updateDto: UpdateSupplierNegotiationNoteDto) {
    await this.findOne(id);
    return this.prisma.supplierNegotiationNote.update({
      where: { id },
      data: {
        ...updateDto,
        ...(updateDto.date && { date: new Date(updateDto.date) }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.supplierNegotiationNote.delete({
      where: { id },
    });
  }
}

