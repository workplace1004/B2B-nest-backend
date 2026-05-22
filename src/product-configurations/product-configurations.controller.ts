import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProductConfigurationsService } from './product-configurations.service';
import { UpdateProductConfigurationDto } from './dto/update-product-configuration.dto';
import { ProductConfigurationType } from '@prisma/client';

@Controller('product-configurations')
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

