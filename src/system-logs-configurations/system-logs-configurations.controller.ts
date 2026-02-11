import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { SystemLogsConfigurationsService } from './system-logs-configurations.service';
import { UpdateSystemLogsConfigurationDto } from './dto/update-system-logs-configuration.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('system-logs-configurations')
@UseGuards(JwtAuthGuard)
export class SystemLogsConfigurationsController {
  constructor(private readonly systemLogsConfigurationsService: SystemLogsConfigurationsService) {}

  @Post()
  upsert(@Body() updateSystemLogsConfigurationDto: UpdateSystemLogsConfigurationDto) {
    return this.systemLogsConfigurationsService.upsert(updateSystemLogsConfigurationDto.data);
  }

  @Get()
  findOne() {
    return this.systemLogsConfigurationsService.findOne();
  }
}

