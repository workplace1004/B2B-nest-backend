import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      totalInventoryValue,
      lowStockItems,
      recentOrders,
      lastMonthOrders,
      lastMonthCustomers,
      thisMonthOrders,
      thisMonthCustomers,
      ordersLast6Months,
      customersLast6Months,
      orderStatusBreakdown,
      ordersByTime,
      customerRetention,
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
      // Last month orders count
      this.prisma.order.count({
        where: {
          orderDate: {
            gte: lastMonth,
            lt: thisMonth,
          },
        },
      }),
      // Last month customers count
      this.prisma.customer.count({
        where: {
          createdAt: {
            gte: lastMonth,
            lt: thisMonth,
          },
        },
      }),
      // This month orders count
      this.prisma.order.count({
        where: {
          orderDate: {
            gte: thisMonth,
          },
        },
      }),
      // This month customers count
      this.prisma.customer.count({
        where: {
          createdAt: {
            gte: thisMonth,
          },
        },
      }),
      // Orders for last 6 months (for trends)
      this.getOrdersByMonth(6),
      // Customers for last 6 months (for trends)
      this.getCustomersByMonth(6),
      // Order status breakdown
      this.getOrderStatusBreakdown(),
      // Orders by time of day and day of week
      this.getOrdersByTime(),
      // Customer retention
      this.getCustomerRetention(),
    ]);

    // Calculate percentage changes
    const orderChangePercent = lastMonthOrders > 0
      ? ((thisMonthOrders - lastMonthOrders) / lastMonthOrders) * 100
      : 0;
    const customerChangePercent = lastMonthCustomers > 0
      ? ((thisMonthCustomers - lastMonthCustomers) / lastMonthCustomers) * 100
      : 0;

    return {
      totalProducts,
      totalOrders,
      totalCustomers,
      totalInventoryValue,
      lowStockItems,
      recentOrders,
      // Trend data
      customerTrend: customersLast6Months,
      orderTrend: ordersLast6Months,
      // Percentage changes
      orderChangePercent: Number(orderChangePercent.toFixed(2)),
      customerChangePercent: Number(customerChangePercent.toFixed(2)),
      lastMonthOrders,
      thisMonthOrders,
      lastMonthCustomers,
      thisMonthCustomers,
      // Breakdowns
      orderStatusBreakdown,
      ordersByTime,
      customerRetention,
    };
  }

  private async getOrdersByMonth(months: number) {
    const now = new Date();
    const data = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const count = await this.prisma.order.count({
        where: {
          orderDate: {
            gte: date,
            lt: nextDate,
          },
        },
      });
      
      data.push(count);
    }
    
    return data;
  }

  private async getCustomersByMonth(months: number) {
    const now = new Date();
    const data = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const count = await this.prisma.customer.count({
        where: {
          createdAt: {
            gte: date,
            lt: nextDate,
          },
        },
      });
      
      data.push(count);
    }
    
    return data;
  }

  private async getOrderStatusBreakdown() {
    const statuses = await this.prisma.order.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    const total = await this.prisma.order.count();
    
    return statuses.map((s) => ({
      status: s.status,
      count: s._count.id,
      percentage: total > 0 ? (s._count.id / total) * 100 : 0,
    }));
  }

  private async getOrdersByTime() {
    const orders = await this.prisma.order.findMany({
      select: {
        orderDate: true,
      },
    });

    // Initialize data structure: 5 time slots x 7 days
    const timeSlots = ['8am', '10am', '12pm', '2pm', '4pm'];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data: number[][] = timeSlots.map(() => new Array(7).fill(0));

    orders.forEach((order) => {
      const date = new Date(order.orderDate);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const hour = date.getHours();

      // Map to our time slots
      let timeSlotIndex = -1;
      if (hour >= 8 && hour < 10) timeSlotIndex = 0; // 8am
      else if (hour >= 10 && hour < 12) timeSlotIndex = 1; // 10am
      else if (hour >= 12 && hour < 14) timeSlotIndex = 2; // 12pm
      else if (hour >= 14 && hour < 16) timeSlotIndex = 3; // 2pm
      else if (hour >= 16 && hour < 18) timeSlotIndex = 4; // 4pm

      // Map day: Sunday (0) -> Sat (6), Monday (1) -> Mon (0)
      const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

      if (timeSlotIndex >= 0 && dayIndex >= 0) {
        data[timeSlotIndex][dayIndex]++;
      }
    });

    return {
      timeSlots,
      days,
      data,
    };
  }

  private async getCustomerRetention() {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    
    // Get all customers with their first order date
    const customers = await this.prisma.customer.findMany({
      include: {
        orders: {
          orderBy: {
            orderDate: 'asc',
          },
          take: 1,
        },
      },
    });

    // Group customers by their first order month
    const monthlyData: Record<string, { total: number; repeat: number }> = {};
    
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthKey = `${monthStart.getFullYear()}-${monthStart.getMonth()}`;
      
      monthlyData[monthKey] = { total: 0, repeat: 0 };
      
      customers.forEach((customer) => {
        const firstOrder = customer.orders[0];
        if (firstOrder) {
          const firstOrderDate = new Date(firstOrder.orderDate);
          if (firstOrderDate >= monthStart && firstOrderDate < monthEnd) {
            monthlyData[monthKey].total++;
            // Check if they have more than one order
            if (customer.orders.length > 1) {
              monthlyData[monthKey].repeat++;
            }
          }
        }
      });
    }

    // Calculate retention percentages for last 6 months
    const retentionData = Object.keys(monthlyData)
      .sort()
      .slice(-6)
      .map((key) => {
        const { total, repeat } = monthlyData[key];
        return total > 0 ? (repeat / total) * 100 : 0;
      });

    return retentionData;
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
      orderBy: {
        orderDate: 'asc',
      },
    });

    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0,
    );

    // Calculate monthly revenue breakdown
    const monthlyRevenue = this.calculateMonthlyRevenue(orders);

    // Get previous period for comparison
    let previousPeriodRevenue = 0;
    if (startDate && endDate) {
      const periodDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const prevStartDate = new Date(startDate);
      prevStartDate.setDate(prevStartDate.getDate() - periodDays);
      const prevEndDate = new Date(startDate);
      
      const prevOrders = await this.prisma.order.findMany({
        where: {
          orderDate: {
            gte: prevStartDate,
            lt: prevEndDate,
          },
        },
      });
      
      previousPeriodRevenue = prevOrders.reduce(
        (sum, order) => sum + Number(order.totalAmount),
        0,
      );
    }

    const revenueChangePercent = previousPeriodRevenue > 0
      ? ((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100
      : 0;

    return {
      orders,
      totalRevenue,
      orderCount: orders.length,
      monthlyRevenue,
      previousPeriodRevenue,
      revenueChangePercent: Number(revenueChangePercent.toFixed(2)),
    };
  }

  private calculateMonthlyRevenue(orders: any[]) {
    const monthlyData: Record<string, number> = {};
    
    orders.forEach((order) => {
      const orderDate = new Date(order.orderDate);
      const monthKey = `${orderDate.getFullYear()}-${orderDate.getMonth()}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0;
      }
      
      monthlyData[monthKey] += Number(order.totalAmount || 0);
    });

    // Convert to array format, sorted by date
    const sortedKeys = Object.keys(monthlyData).sort();
    return sortedKeys.map((key) => monthlyData[key]);
  }
}

