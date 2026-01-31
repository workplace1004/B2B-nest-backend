import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboardStats() {
    return this.analyticsService.getDashboardStats();
  }

  @Get('sales')
  getSalesReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('timeRange') timeRange?: 'today' | 'week' | 'month',
  ) {
    // Parse date strings as local dates (YYYY-MM-DD format)
    const parseLocalDate = (dateStr: string): Date => {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    };

    return this.analyticsService.getSalesReport(
      startDate ? parseLocalDate(startDate) : undefined,
      endDate ? parseLocalDate(endDate) : undefined,
      timeRange,
    );
  }

  @Get('reviews')
  getReviewsStats() {
    return this.analyticsService.getReviewsStats();
  }
}

