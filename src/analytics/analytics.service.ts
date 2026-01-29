import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      totalInventoryValue,
      lowStockItems,
      recentOrders,
    ] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.customer.count(),
      this.prisma.inventory.findMany().then((items) =>
        items.reduce((sum, item) => sum + Number(item.quantity), 0),
      ),
      this.prisma.inventory.findMany({
        where: {
          quantity: {
            lte: 10,
          },
        },
        include: {
          product: true,
          warehouse: true,
        },
        take: 10,
      }),
      this.prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: true,
        },
      }),
    ]);

    return {
      totalProducts,
      totalOrders,
      totalCustomers,
      totalInventoryValue,
      lowStockItems,
      recentOrders,
    };
  }

  async getSalesReport(startDate?: Date, endDate?: Date) {
    const where: any = {};
    if (startDate || endDate) {
      where.orderDate = {};
      if (startDate) where.orderDate.gte = startDate;
      if (endDate) where.orderDate.lte = endDate;
    }

    const orders = await this.prisma.order.findMany({
      where,
      include: {
        orderLines: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    });

    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0,
    );

    return {
      orders,
      totalRevenue,
      orderCount: orders.length,
    };
  }
}

