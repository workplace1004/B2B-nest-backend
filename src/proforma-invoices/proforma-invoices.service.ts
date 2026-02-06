import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProformaInvoiceDto } from './dto/create-proforma-invoice.dto';
import { UpdateProformaInvoiceDto } from './dto/update-proforma-invoice.dto';

@Injectable()
export class ProformaInvoicesService {
  constructor(private prisma: PrismaService) {}

  async create(createProformaInvoiceDto: CreateProformaInvoiceDto) {
    const invoiceNumber = `INV-${Date.now()}`;
    
    // Calculate totals if not provided
    let subtotal = createProformaInvoiceDto.subtotal || 0;
    let totalAmount = createProformaInvoiceDto.totalAmount || 0;
    
    if (createProformaInvoiceDto.invoiceLines && createProformaInvoiceDto.invoiceLines.length > 0) {
      subtotal = createProformaInvoiceDto.invoiceLines.reduce(
        (sum, line) => sum + Number(line.unitPrice) * line.quantity,
        0,
      );
      
      const taxRate = createProformaInvoiceDto.taxRate || 0;
      const discountPercent = createProformaInvoiceDto.discountPercent || 0;
      const discountAmount = subtotal * (discountPercent / 100);
      const taxAmount = (subtotal - discountAmount) * (taxRate / 100);
      totalAmount = subtotal - discountAmount + taxAmount;
    }

    return this.prisma.proformaInvoice.create({
      data: {
        ...createProformaInvoiceDto,
        invoiceNumber,
        subtotal,
        taxAmount: createProformaInvoiceDto.taxAmount || (subtotal * ((createProformaInvoiceDto.taxRate || 0) / 100)),
        discountAmount: createProformaInvoiceDto.discountAmount || (subtotal * ((createProformaInvoiceDto.discountPercent || 0) / 100)),
        totalAmount,
        invoiceLines: createProformaInvoiceDto.invoiceLines
          ? {
              create: createProformaInvoiceDto.invoiceLines.map((line) => ({
                ...line,
                totalPrice: Number(line.unitPrice) * line.quantity,
              })),
            }
          : undefined,
      },
      include: {
        customer: true,
        quote: true,
        order: true,
        user: true,
        invoiceLines: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findAll(skip = 0, take = 10, status?: string, customerId?: number) {
    const where: any = {};
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;

    const [data, total] = await Promise.all([
      this.prisma.proformaInvoice.findMany({
        where,
        skip,
        take,
        include: {
          customer: true,
          quote: true,
          order: true,
          user: true,
          invoiceLines: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.proformaInvoice.count({ where }),
    ]);
    return { data, total, skip, take };
  }

  async findOne(id: number) {
    const invoice = await this.prisma.proformaInvoice.findUnique({
      where: { id },
      include: {
        customer: true,
        quote: true,
        order: true,
        user: true,
        invoiceLines: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!invoice) {
      throw new NotFoundException(`Proforma invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async update(id: number, updateProformaInvoiceDto: UpdateProformaInvoiceDto) {
    await this.findOne(id);
    
    // Extract invoiceLines if present
    const { invoiceLines, ...invoiceData } = updateProformaInvoiceDto;
    
    // Recalculate totals if invoiceLines are being updated
    let updateData: any = { ...invoiceData };
    
    if (invoiceLines && invoiceLines.length > 0) {
      const subtotal = invoiceLines.reduce(
        (sum, line) => sum + Number(line.unitPrice) * line.quantity,
        0,
      );
      
      const taxRate = updateData.taxRate || 0;
      const discountPercent = updateData.discountPercent || 0;
      const discountAmount = subtotal * (discountPercent / 100);
      const taxAmount = (subtotal - discountAmount) * (taxRate / 100);
      const totalAmount = subtotal - discountAmount + taxAmount;
      
      updateData.subtotal = subtotal;
      updateData.discountAmount = discountAmount;
      updateData.taxAmount = taxAmount;
      updateData.totalAmount = totalAmount;
    }

    return this.prisma.proformaInvoice.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        quote: true,
        order: true,
        user: true,
        invoiceLines: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.proformaInvoice.delete({
      where: { id },
    });
  }
}

