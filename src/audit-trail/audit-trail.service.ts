import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type TransactionType = 'order' | 'payment' | 'inventory' | 'invoice' | 'credit-note' | 'return' | 'adjustment';
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'cancelled' | 'refunded';

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  entityId: number;
  entityName: string;
  amount: number;
  currency: string;
  userId: number | null;
  userName: string;
  timestamp: string;
  description: string;
  changes?: Array<{
    field: string;
    oldValue: any;
    newValue: any;
  }>;
  metadata?: Record<string, any>;
}

@Injectable()
export class AuditTrailService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    skip: number,
    take: number,
    search?: string,
    type?: string,
    status?: string,
    dateRange?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<{ data: Transaction[]; total: number }> {
    const transactions: Transaction[] = [];

    // Calculate date range for database filtering
    const now = new Date();
    let dateFilterStart: Date | null = null;
    let dateFilterEnd: Date | null = null;

    if (dateRange === 'today') {
      dateFilterStart = new Date(now);
      dateFilterStart.setHours(0, 0, 0, 0);
    } else if (dateRange === 'week') {
      dateFilterStart = new Date(now);
      dateFilterStart.setDate(now.getDate() - 7);
    } else if (dateRange === 'month') {
      dateFilterStart = new Date(now);
      dateFilterStart.setMonth(now.getMonth() - 1);
    } else if (dateRange === 'year') {
      dateFilterStart = new Date(now);
      dateFilterStart.setFullYear(now.getFullYear() - 1);
    }

    if (startDate) {
      dateFilterStart = new Date(startDate);
    }
    if (endDate) {
      dateFilterEnd = new Date(endDate);
      dateFilterEnd.setHours(23, 59, 59, 999);
    }

    // Fetch orders
    const ordersWhere: any = {};
    if (search) {
      ordersWhere.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (dateFilterStart || dateFilterEnd) {
      ordersWhere.createdAt = {};
      if (dateFilterStart) ordersWhere.createdAt.gte = dateFilterStart;
      if (dateFilterEnd) ordersWhere.createdAt.lte = dateFilterEnd;
    }
    if (type === 'order' || !type || type === 'all') {
      const orders = await this.prisma.order.findMany({
        where: ordersWhere,
        include: { customer: true },
        orderBy: { createdAt: 'desc' },
      });

      orders.forEach((order) => {
        const statusMap: Record<string, TransactionStatus> = {
          FULFILLED: 'completed',
          SHIPPED: 'completed',
          DELIVERED: 'completed',
          CANCELLED: 'cancelled',
          PENDING: 'pending',
          CONFIRMED: 'pending',
          PROCESSING: 'pending',
        };

        transactions.push({
          id: `order-${order.id}`,
          type: 'order',
          status: statusMap[order.status] || 'pending',
          entityId: order.id,
          entityName: `Order #${order.orderNumber || order.id}`,
          amount: Number(order.totalAmount) || 0,
          currency: order.currency || 'USD',
          userId: order.customerId || null,
          userName: order.customer?.name || 'System',
          timestamp: order.createdAt.toISOString(),
          description: `Order ${(order.status || '').toLowerCase().replace('_', ' ')}`,
          metadata: {
            orderNumber: order.orderNumber,
            status: order.status,
          },
        });
      });
    }

    // Fetch proforma invoices
    const invoicesWhere: any = {};
    if (search) {
      invoicesWhere.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (dateFilterStart || dateFilterEnd) {
      invoicesWhere.createdAt = {};
      if (dateFilterStart) invoicesWhere.createdAt.gte = dateFilterStart;
      if (dateFilterEnd) invoicesWhere.createdAt.lte = dateFilterEnd;
    }
    if (type === 'invoice' || !type || type === 'all') {
      const invoices = await this.prisma.proformaInvoice.findMany({
        where: invoicesWhere,
        include: { customer: true },
        orderBy: { createdAt: 'desc' },
      });

      invoices.forEach((invoice) => {
        const statusMap: Record<string, TransactionStatus> = {
          PAID: 'completed',
          CANCELLED: 'cancelled',
          PENDING: 'pending',
          OVERDUE: 'failed',
        };

        transactions.push({
          id: `invoice-${invoice.id}`,
          type: 'invoice',
          status: statusMap[invoice.status] || 'pending',
          entityId: invoice.id,
          entityName: `Invoice #${invoice.invoiceNumber || invoice.id}`,
          amount: Number(invoice.totalAmount) || 0,
          currency: invoice.currency || 'USD',
          userId: invoice.customerId || null,
          userName: invoice.customer?.name || 'System',
          timestamp: invoice.createdAt.toISOString(),
          description: `Invoice ${(invoice.status || '').toLowerCase()}`,
          metadata: {
            invoiceNumber: invoice.invoiceNumber,
            status: invoice.status,
          },
        });
      });
    }

    // Fetch returns
    const returnsWhere: any = {};
    if (search) {
      returnsWhere.OR = [
        { rmaNumber: { contains: search, mode: 'insensitive' } },
        { order: { orderNumber: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (dateFilterStart || dateFilterEnd) {
      returnsWhere.createdAt = {};
      if (dateFilterStart) returnsWhere.createdAt.gte = dateFilterStart;
      if (dateFilterEnd) returnsWhere.createdAt.lte = dateFilterEnd;
    }
    if (type === 'return' || !type || type === 'all') {
      const returns = await this.prisma.return.findMany({
        where: returnsWhere,
        include: {
          order: {
            include: { customer: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      returns.forEach((returnItem) => {
        const statusMap: Record<string, TransactionStatus> = {
          COMPLETED: 'completed',
          REFUNDED: 'refunded',
          PENDING: 'pending',
          CANCELLED: 'cancelled',
          REJECTED: 'failed',
        };

        transactions.push({
          id: `return-${returnItem.id}`,
          type: 'return',
          status: statusMap[returnItem.status] || 'pending',
          entityId: returnItem.id,
          entityName: `Return #${returnItem.rmaNumber || returnItem.id}`,
          amount: Number(returnItem.refundAmount) || 0,
          currency: returnItem.order?.currency || 'USD',
          userId: returnItem.order?.customerId || null,
          userName: returnItem.order?.customer?.name || 'System',
          timestamp: returnItem.createdAt.toISOString(),
          description: `Return ${(returnItem.status || '').toLowerCase()}`,
          metadata: {
            rmaNumber: returnItem.rmaNumber,
            status: returnItem.status,
          },
        });
      });
    }

    // Apply filters
    let filtered = transactions;

    // Filter by type (if not already filtered at DB level)
    if (type && type !== 'all' && type !== 'order' && type !== 'invoice' && type !== 'return') {
      filtered = filtered.filter((tx) => tx.type === type);
    }

    // Filter by status
    if (status && status !== 'all') {
      filtered = filtered.filter((tx) => tx.status === status);
    }

    // Additional search filtering (for fields not searchable at DB level)
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((tx) =>
        tx.entityName.toLowerCase().includes(searchLower) ||
        tx.description.toLowerCase().includes(searchLower) ||
        tx.userName.toLowerCase().includes(searchLower) ||
        tx.id.toString().toLowerCase().includes(searchLower)
      );
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Apply pagination
    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + take);

    return {
      data: paginated,
      total,
    };
  }

  async getSummary(
    type?: string,
    status?: string,
    dateRange?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<{ total: number; completed: number; pending: number; failed: number; totalAmount: number }> {
    // Get all transactions (without pagination for summary)
    const result = await this.findAll(0, 10000, undefined, type, status, dateRange, startDate, endDate);
    const transactions = result.data;

    const total = transactions.length;
    const completed = transactions.filter((tx) => tx.status === 'completed').length;
    const pending = transactions.filter((tx) => tx.status === 'pending').length;
    const failed = transactions.filter((tx) => tx.status === 'failed').length;
    const totalAmount = transactions
      .filter((tx) => tx.status === 'completed')
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      total,
      completed,
      pending,
      failed,
      totalAmount,
    };
  }
}

