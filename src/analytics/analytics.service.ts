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
      // Orders for last 6 months (for trends) - returns { data, labels }
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
      orderTrend: Array.isArray(ordersLast6Months) ? ordersLast6Months : ordersLast6Months.data,
      orderTrendLabels: Array.isArray(ordersLast6Months) ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] : ordersLast6Months.labels,
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
    const labels: string[] = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
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
      labels.push(monthNames[date.getMonth()]);
    }
    
    return { data, labels };
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

  async getSalesReport(startDate?: Date, endDate?: Date, timeRange?: 'today' | 'week' | 'month') {
    const where: any = {};
    
    if (startDate || endDate) {
      where.orderDate = {};
      if (startDate) {
        // Ensure startDate is at the beginning of the day
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        where.orderDate.gte = start;
      }
      if (endDate) {
        // Ensure endDate is at the end of the day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.orderDate.lte = end;
      }
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

    // Calculate revenue breakdown based on time range
    let revenueData: number[] = [];
    let labels: string[] = [];
    
    if (timeRange === 'today') {
      const hourlyData = this.calculateHourlyRevenue(orders);
      revenueData = hourlyData.data;
      labels = hourlyData.labels;
    } else if (timeRange === 'week') {
      const dailyData = this.calculateDailyRevenue(orders);
      revenueData = dailyData.data;
      labels = dailyData.labels;
    } else {
      // Default to monthly - return last 12 months
      const monthlyData = this.calculateMonthlyRevenueForPeriod(orders, startDate, endDate);
      revenueData = monthlyData.data;
      labels = monthlyData.labels;
    }
    
    // Keep monthlyRevenue for backward compatibility
    const monthlyRevenue = this.calculateMonthlyRevenue(orders);

    // Get previous period for comparison
    let previousPeriodRevenue = 0;
    if (timeRange === 'today' && startDate) {
      // For today, compare with yesterday (based on the startDate passed)
      const yesterday = new Date(startDate);
      yesterday.setDate(yesterday.getDate() - 1);
      const startOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0, 0);
      const endOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59, 999);
      
      const prevOrders = await this.prisma.order.findMany({
        where: {
          orderDate: {
            gte: startOfYesterday,
            lte: endOfYesterday,
          },
        },
      });
      
      previousPeriodRevenue = prevOrders.reduce(
        (sum, order) => sum + Number(order.totalAmount),
        0,
      );
    } else if (startDate && endDate) {
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
      revenueData, // New: data array based on time range
      labels, // New: labels array based on time range
      previousPeriodRevenue,
      revenueChangePercent: Number(revenueChangePercent.toFixed(2)),
    };
  }

  private calculateHourlyRevenue(orders: any[]) {
    // 12 intervals: 2 AM, 4 AM, 6 AM, 8 AM, 10 AM, 12 PM, 2 PM, 4 PM, 6 PM, 8 PM, 10 PM, 12 AM
    const hourlyData: number[] = Array(12).fill(0);
    const labels = ['2 AM', '4 AM', '6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM', '12 AM'];
    
    orders.forEach((order) => {
      const orderDate = new Date(order.orderDate);
      const hour = orderDate.getHours();
      
      // Map hours to 2-hour intervals
      // 12 AM: hours 0-1 (index 11)
      // 2 AM: hours 2-3 (index 0)
      // 4 AM: hours 4-5 (index 1)
      // 6 AM: hours 6-7 (index 2)
      // 8 AM: hours 8-9 (index 3)
      // 10 AM: hours 10-11 (index 4)
      // 12 PM: hours 12-13 (index 5)
      // 2 PM: hours 14-15 (index 6)
      // 4 PM: hours 16-17 (index 7)
      // 6 PM: hours 18-19 (index 8)
      // 8 PM: hours 20-21 (index 9)
      // 10 PM: hours 22-23 (index 10)
      let intervalIndex: number;
      if (hour >= 0 && hour < 2) {
        intervalIndex = 11; // 12 AM
      } else {
        intervalIndex = Math.floor((hour - 2) / 2);
      }
      
      hourlyData[intervalIndex] += Number(order.totalAmount || 0);
    });
    
    return { data: hourlyData, labels };
  }

  private calculateDailyRevenue(orders: any[]) {
    // 7 days: Mon, Tue, Wed, Thu, Fri, Sat, Sun
    const dailyData: number[] = Array(7).fill(0);
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    orders.forEach((order) => {
      const orderDate = new Date(order.orderDate);
      const dayOfWeek = orderDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      
      // Convert to Monday = 0, Tuesday = 1, ..., Sunday = 6
      const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      
      dailyData[dayIndex] += Number(order.totalAmount || 0);
    });
    
    return { data: dailyData, labels };
  }

  private calculateMonthlyRevenueForPeriod(orders: any[], startDate?: Date, endDate?: Date) {
    // Always return 12 months of data (last 12 months from endDate, or current date if not provided)
    const monthlyData: number[] = Array(12).fill(0);
    const monthLabels: string[] = [];
    
    // Use endDate if provided, otherwise use current date
    const referenceDate = endDate || new Date();
    const currentYear = referenceDate.getFullYear();
    const currentMonth = referenceDate.getMonth();
    
    // Create a map of year-month to array index (last 12 months ending at referenceDate)
    // For example, if referenceDate is Jan 2026, we want: Feb 2025, Mar 2025, ..., Dec 2025, Jan 2026
    const monthMap: Record<string, number> = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(currentYear, currentMonth - (11 - i), 1);
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();
      const key = `${year}-${month}`;
      monthMap[key] = i;
      monthLabels.push(monthNames[month]);
    }
    
    orders.forEach((order) => {
      const orderDate = new Date(order.orderDate);
      const year = orderDate.getFullYear();
      const month = orderDate.getMonth();
      const key = `${year}-${month}`;
      
      if (monthMap[key] !== undefined) {
        monthlyData[monthMap[key]] += Number(order.totalAmount || 0);
      }
    });
    
    return { data: monthlyData, labels: monthLabels };
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

  async getReviewsStats() {
    const now = new Date();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get all reviews
    const allReviews = await this.prisma.review.findMany({
      include: {
        customer: true,
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get reviews for this month
    const thisMonthReviews = allReviews.filter((review) => {
      const reviewDate = new Date(review.createdAt);
      return reviewDate >= thisMonthStart;
    });

    // Get reviews for last month
    const lastMonthReviews = allReviews.filter((review) => {
      const reviewDate = new Date(review.createdAt);
      return reviewDate >= lastMonthStart && reviewDate <= lastMonthEnd;
    });

    // Calculate statistics
    const totalReviews = allReviews.length;
    const newReviewsThisMonth = thisMonthReviews.length;
    const newReviewsLastMonth = lastMonthReviews.length;
    
    // Calculate average rating
    const avgRating = totalReviews > 0
      ? allReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

    // Calculate positive review ratio (4-5 stars)
    const positiveReviews = allReviews.filter((r) => r.rating >= 4).length;
    const positiveRatio = totalReviews > 0 ? (positiveReviews / totalReviews) * 100 : 0;

    // Calculate response rate
    const respondedReviews = allReviews.filter((r) => r.status === 'RESPONDED' || r.status === 'RESOLVED').length;
    const responseRate = totalReviews > 0 ? (respondedReviews / totalReviews) * 100 : 0;

    // Rating distribution
    const ratingDistribution = {
      5: allReviews.filter((r) => r.rating === 5).length,
      4: allReviews.filter((r) => r.rating === 4).length,
      3: allReviews.filter((r) => r.rating === 3).length,
      2: allReviews.filter((r) => r.rating === 2).length,
      1: allReviews.filter((r) => r.rating === 1).length,
    };

    // Review sources breakdown
    const sourceBreakdown = allReviews.reduce((acc, review) => {
      const source = review.source || 'Unknown';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

      // Review trends (last 12 months)
      const reviewTrends = await this.getReviewTrends(12);

      // Monthly rating distribution (last 6 months)
      const monthlyRatingDistribution = await this.getMonthlyRatingDistribution(6);

    // Recent reviews (last 10)
    const recentReviews = allReviews.slice(0, 10).map((review) => ({
      id: review.id,
      customer: review.customer.name,
      rating: review.rating,
      review: review.review,
      date: new Date(review.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      status: review.status === 'RESPONDED' ? 'Responded' : review.status === 'RESOLVED' ? 'Resolved' : 'Pending',
    }));

    // Top rated products
    const productRatings = allReviews
      .filter((r) => r.productId !== null)
      .reduce((acc, review) => {
        if (!review.productId) return acc;
        const productId = review.productId;
        if (!acc[productId]) {
          acc[productId] = {
            productId,
            productName: review.product?.name || 'Unknown Product',
            totalRating: 0,
            count: 0,
          };
        }
        acc[productId].totalRating += review.rating;
        acc[productId].count += 1;
        return acc;
      }, {} as Record<number, { productId: number; productName: string; totalRating: number; count: number }>);

    const topRatedProducts = Object.values(productRatings)
      .map((p) => ({
        product: p.productName,
        rating: p.totalRating / p.count,
        totalReviews: p.count,
      }))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);

    // Calculate percentage changes
    const totalReviewsChange = lastMonthReviews.length > 0
      ? ((newReviewsThisMonth - newReviewsLastMonth) / newReviewsLastMonth) * 100
      : 0;
    const avgRatingChange = 0; // Can be calculated if we track historical averages
    const positiveRatioChange = 0; // Can be calculated if we track historical ratios
    const responseRateChange = 0; // Can be calculated if we track historical rates

    return {
      totalReviews,
      newReviewsThisMonth,
      newReviewsLastMonth,
      totalReviewsChange: Number(totalReviewsChange.toFixed(1)),
      avgRating: Number(avgRating.toFixed(1)),
      avgRatingChange: Number(avgRatingChange.toFixed(1)),
      positiveRatio: Number(positiveRatio.toFixed(0)),
      positiveRatioChange: Number(positiveRatioChange.toFixed(1)),
      responseRate: Number(responseRate.toFixed(0)),
      responseRateChange: Number(responseRateChange.toFixed(1)),
      ratingDistribution,
      sourceBreakdown,
      reviewTrends,
      monthlyRatingDistribution,
      recentReviews,
      topRatedProducts,
    };
  }

  private async getMonthlyRatingDistribution(months: number) {
    const now = new Date();
    const monthlyData: Array<{ month: string; distribution: Record<number, number> }> = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
      
      // Get reviews for this month
      const monthReviews = await this.prisma.review.findMany({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      });

      // Calculate distribution by rating
      const distribution = {
        5: monthReviews.filter((r) => r.rating === 5).length,
        4: monthReviews.filter((r) => r.rating === 4).length,
        3: monthReviews.filter((r) => r.rating === 3).length,
        2: monthReviews.filter((r) => r.rating === 2).length,
        1: monthReviews.filter((r) => r.rating === 1).length,
      };

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      monthlyData.push({
        month: monthNames[monthStart.getMonth()],
        distribution,
      });
    }
    
    // Always return 6 months of data (even if some have zero reviews)
    // This ensures the frontend gets consistent data structure
    return monthlyData;
  }

  private async getReviewTrends(months: number): Promise<number[]> {
    const now = new Date();
    const trends: number[] = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
      
      const count = await this.prisma.review.count({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      });
      
      trends.push(count);
    }
    
    return trends;
  }
}

