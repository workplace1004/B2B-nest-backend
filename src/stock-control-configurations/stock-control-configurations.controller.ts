import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { StockControlConfigurationsService } from './stock-control-configurations.service';
import { UpdateStockControlConfigurationDto } from './dto/update-stock-control-configuration.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StockControlConfigurationType } from '@prisma/client';

@Controller('stock-control-configurations')
@UseGuards(JwtAuthGuard)
export class StockControlConfigurationsController {
  constructor(private readonly stockControlConfigurationsService: StockControlConfigurationsService) {}

  @Post()
  upsert(@Body() updateStockControlConfigurationDto: UpdateStockControlConfigurationDto) {
    return this.stockControlConfigurationsService.upsert(
      updateStockControlConfigurationDto.type,
      updateStockControlConfigurationDto.data,
    );
  }

  @Get()
  findAll() {
    return this.stockControlConfigurationsService.findAll();
  }

  @Get(':type')
  findOne(@Param('type') type: string) {
    return this.stockControlConfigurationsService.findOne(type as StockControlConfigurationType);
  }
}

