import { Controller, Get, Post, Query, Body, Param, UseGuards } from '@nestjs/common';
import { SyncLogsService } from './sync-logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sync-logs')
@UseGuards(JwtAuthGuard)
export class SyncLogsController {
  constructor(private readonly syncLogsService: SyncLogsService) {}

  @Get()
  findAll(@Query('status') status?: string) {
    return this.syncLogsService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.syncLogsService.findOne(+id);
  }

  @Post('start')
  startSync(@Body() body?: { mappingId?: number }) {
    return this.syncLogsService.startSync(body?.mappingId);
  }
}

