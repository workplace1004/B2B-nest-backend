import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { WarehouseConfigurationsService } from './warehouse-configurations.service';
import { UpdateWarehouseConfigurationDto } from './dto/update-warehouse-configuration.dto';
import { WarehouseConfigurationType } from '@prisma/client';

@Controller('warehouse-configurations')
export class WarehouseConfigurationsController {
  constructor(private readonly warehouseConfigurationsService: WarehouseConfigurationsService) {}

  @Post()
  upsert(@Body() updateWarehouseConfigurationDto: UpdateWarehouseConfigurationDto) {
    return this.warehouseConfigurationsService.upsert(
      updateWarehouseConfigurationDto.type,
      updateWarehouseConfigurationDto.data,
    );
  }

  @Get()
  findAll() {
    return this.warehouseConfigurationsService.findAll();
  }

  @Get(':type')
  findOne(@Param('type') type: string) {
    return this.warehouseConfigurationsService.findOne(type as WarehouseConfigurationType);
  }
}

