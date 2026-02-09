import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
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

  @Post('start')
  startSync() {
    return this.syncLogsService.startSync();
  }
}

