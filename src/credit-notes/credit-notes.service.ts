import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCreditNoteDto } from './dto/create-credit-note.dto';
import { UpdateCreditNoteDto } from './dto/update-credit-note.dto';

@Injectable()
export class CreditNotesService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateCreditNoteDto) {
    // Generate credit note number
    const count = await this.prisma.creditNote.count();
    const creditNoteNumber = `CN-${String(count + 1).padStart(6, '0')}`;

    const creditNote = await this.prisma.creditNote.create({
      data: {
        creditNoteNumber,
        invoiceId: createDto.invoiceId,
        returnId: createDto.returnId,
        customerId: createDto.customerId,
        amount: createDto.amount,
        currency: createDto.currency || 'USD',
        reason: createDto.reason,
        status: createDto.status || 'DRAFT',
        notes: createDto.notes,
        issuedDate: createDto.status === 'ISSUED' ? new Date() : undefined,
      },
      include: {
        customer: true,
        invoice: true,
        return: true,
      },
    });

    return { data: this.mapCreditNote(creditNote) };
  }

  async findAll(skip?: number, take?: number) {
    const creditNotes = await this.prisma.creditNote.findMany({
      skip: skip,
      take: take,
      include: {
        customer: true,
        invoice: true,
        return: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: creditNotes.map((cn) => this.mapCreditNote(cn)),
      total: await this.prisma.creditNote.count(),
    };
  }

  async findOne(id: number) {
    const creditNote = await this.prisma.creditNote.findUnique({
      where: { id },
      include: {
        customer: true,
        invoice: true,
        return: true,
      },
    });

    if (!creditNote) {
      throw new NotFoundException(`Credit note with ID ${id} not found`);
    }

    return { data: this.mapCreditNote(creditNote) };
  }

  async update(id: number, updateDto: UpdateCreditNoteDto) {
    try {
      const updateData: any = {
        amount: updateDto.amount,
        currency: updateDto.currency,
        reason: updateDto.reason,
        notes: updateDto.notes,
      };

      if (updateDto.status) {
        updateData.status = updateDto.status;
        if (updateDto.status === 'ISSUED' && !updateDto.issuedDate) {
          updateData.issuedDate = new Date();
        }
        if (updateDto.status === 'APPLIED' && !updateDto.appliedDate) {
          updateData.appliedDate = new Date();
        }
      }

      if (updateDto.issuedDate) {
        updateData.issuedDate = new Date(updateDto.issuedDate);
      }
      if (updateDto.appliedDate) {
        updateData.appliedDate = new Date(updateDto.appliedDate);
      }

      const creditNote = await this.prisma.creditNote.update({
        where: { id },
        data: updateData,
        include: {
          customer: true,
          invoice: true,
          return: true,
        },
      });

      return { data: this.mapCreditNote(creditNote) };
    } catch (error) {
      throw new NotFoundException(`Credit note with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      const creditNote = await this.prisma.creditNote.delete({
        where: { id },
      });

      return { data: this.mapCreditNote(creditNote) };
    } catch (error) {
      throw new NotFoundException(`Credit note with ID ${id} not found`);
    }
  }

  private mapCreditNote(creditNote: any) {
    return {
      id: creditNote.id,
      creditNoteNumber: creditNote.creditNoteNumber,
      invoiceId: creditNote.invoiceId,
      returnId: creditNote.returnId,
      customerId: creditNote.customerId,
      customerName: creditNote.customer?.name || 'Unknown Customer',
      invoiceNumber: creditNote.invoice?.invoiceNumber,
      returnNumber: creditNote.return?.rmaNumber,
      amount: Number(creditNote.amount),
      currency: creditNote.currency,
      reason: creditNote.reason,
      status: creditNote.status.toLowerCase(),
      issuedDate: creditNote.issuedDate?.toISOString(),
      appliedDate: creditNote.appliedDate?.toISOString(),
      notes: creditNote.notes,
      createdAt: creditNote.createdAt.toISOString(),
      updatedAt: creditNote.updatedAt.toISOString(),
    };
  }
}




