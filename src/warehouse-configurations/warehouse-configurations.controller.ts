import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { WarehouseConfigurationsService } from './warehouse-configurations.service';
import { UpdateWarehouseConfigurationDto } from './dto/update-warehouse-configuration.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WarehouseConfigurationType } from '@prisma/client';

@Controller('warehouse-configurations')
@UseGuards(JwtAuthGuard)
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

