import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) {}

  async create(createQuoteDto: CreateQuoteDto) {
    const { lines, ...quoteData } = createQuoteDto;
    
    return this.prisma.quote.create({
      data: {
        ...quoteData,
        quoteLines: {
          create: lines.map((line) => ({
            productId: line.productId,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            totalPrice: line.totalPrice,
            size: line.size,
            color: line.color,
            description: line.description,
          })),
        },
      },
      include: {
        customer: true,
        user: true,
        quoteLines: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findAll(skip: number, take: number, status?: string, search?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { quoteNumber: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.quote.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          quoteLines: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.quote.count({ where }),
    ]);

    return { data, total };
  }

  async findOne(id: number) {
    const quote = await this.prisma.quote.findUnique({
      where: { id },
      include: {
        customer: true,
        user: true,
        quoteLines: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!quote) {
      throw new NotFoundException(`Quote with ID ${id} not found`);
    }
    return quote;
  }

  async update(id: number, updateQuoteDto: UpdateQuoteDto) {
    await this.findOne(id); // Check if exists
    
    const { lines, ...quoteData } = updateQuoteDto;
    
    if (lines) {
      // Delete existing lines and create new ones
      await this.prisma.quoteLine.deleteMany({
        where: { quoteId: id },
      });
    }

    return this.prisma.quote.update({
      where: { id },
      data: {
        ...quoteData,
        ...(lines && {
          quoteLines: {
            create: lines.map((line: any) => ({
              productId: line.productId,
              quantity: line.quantity,
              unitPrice: line.unitPrice,
              totalPrice: line.totalPrice,
              size: line.size,
              color: line.color,
              description: line.description,
            })),
          },
        }),
      },
      include: {
        customer: true,
        user: true,
        quoteLines: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Check if exists
    return this.prisma.quote.delete({
      where: { id },
    });
  }
}

