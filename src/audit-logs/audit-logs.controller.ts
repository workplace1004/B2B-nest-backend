import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuditAction } from '@prisma/client';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard)
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.auditLogsService.findAll(
      skip ? +skip : undefined,
      take ? +take : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auditLogsService.findOne(+id);
  }

  @Post()
  create(
    @Request() req: any,
    @Body() body: {
      action: AuditAction;
      entityType: string;
      entityId?: number | null;
      changes?: any;
    },
  ) {
    const userId = req.user?.userId || req.user?.sub || req.user?.id || 1; // Get user ID from JWT token
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    return this.auditLogsService.create({
      userId,
      action: body.action,
      entityType: body.entityType,
      entityId: body.entityId || null,
      changes: body.changes || null,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
    });
  }
}

