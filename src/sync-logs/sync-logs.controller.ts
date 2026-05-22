import { Controller, Get, Post, Query, Body, Param } from '@nestjs/common';
import { SyncLogsService } from './sync-logs.service';
@Controller('sync-logs')
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

