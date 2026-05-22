import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SupplierPriceHistoryService } from './supplier-price-history.service';
import { CreateSupplierPriceHistoryDto } from './dto/create-supplier-price-history.dto';
import { UpdateSupplierPriceHistoryDto } from './dto/update-supplier-price-history.dto';
@Controller('supplier-price-history')
export class SupplierPriceHistoryController {
  constructor(private readonly service: SupplierPriceHistoryService) {}

  @Post()
  create(@Body() createDto: CreateSupplierPriceHistoryDto) {
    return this.service.create(createDto);
  }

  @Get()
  findAll(@Query('supplierId') supplierId?: string) {
    return this.service.findAll(supplierId ? +supplierId : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateSupplierPriceHistoryDto) {
    return this.service.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

