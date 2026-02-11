import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ProductConfigurationsService } from './product-configurations.service';
import { UpdateProductConfigurationDto } from './dto/update-product-configuration.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProductConfigurationType } from '@prisma/client';

@Controller('product-configurations')
@UseGuards(JwtAuthGuard)
export class ProductConfigurationsController {
  constructor(private readonly productConfigurationsService: ProductConfigurationsService) {}

  @Post()
  upsert(@Body() updateProductConfigurationDto: UpdateProductConfigurationDto) {
    return this.productConfigurationsService.upsert(
      updateProductConfigurationDto.type,
      updateProductConfigurationDto.data,
    );
  }

  @Get()
  findAll() {
    return this.productConfigurationsService.findAll();
  }

  @Get(':type')
  findOne(@Param('type') type: string) {
    return this.productConfigurationsService.findOne(type as ProductConfigurationType);
  }
}

