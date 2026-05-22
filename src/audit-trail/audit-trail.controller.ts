import { Controller, Get, Query } from '@nestjs/common';
import { AuditTrailService } from './audit-trail.service';
@Controller('audit-trail')
export class AuditTrailController {
  constructor(private readonly auditTrailService: AuditTrailService) {}

  @Get()
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('dateRange') dateRange?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.auditTrailService.findAll(
      skip ? +skip : 0,
      take ? +take : 10,
      search,
      type,
      status,
      dateRange,
      startDate,
      endDate,
    );
  }

  @Get('summary')
  async getSummary(
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('dateRange') dateRange?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.auditTrailService.getSummary(
      type,
      status,
      dateRange,
      startDate,
      endDate,
    );
  }
}

