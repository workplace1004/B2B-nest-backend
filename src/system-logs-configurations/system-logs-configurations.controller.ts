import { Controller, Get, Post, Body } from '@nestjs/common';
import { SystemLogsConfigurationsService } from './system-logs-configurations.service';
import { UpdateSystemLogsConfigurationDto } from './dto/update-system-logs-configuration.dto';
@Controller('system-logs-configurations')
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

