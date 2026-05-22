import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { WarehouseDefaultsService } from './warehouse-defaults.service';
import { CreateWarehouseDefaultDto } from './dto/create-warehouse-default.dto';
import { UpdateWarehouseDefaultDto } from './dto/update-warehouse-default.dto';
@Controller('warehouse-defaults')
export class WarehouseDefaultsController {
  constructor(private readonly warehouseDefaultsService: WarehouseDefaultsService) {}

  @Post()
      create(@Body() createWarehouseDefaultDto: CreateWarehouseDefaultDto) {
    return this.warehouseDefaultsService.create(createWarehouseDefaultDto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: string,
  ) {
    return this.warehouseDefaultsService.findAll(skip ? +skip : undefined, take ? +take : undefined, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warehouseDefaultsService.findOne(+id);
  }

  @Patch(':id')
      update(@Param('id') id: string, @Body() updateWarehouseDefaultDto: UpdateWarehouseDefaultDto) {
    return this.warehouseDefaultsService.update(+id, updateWarehouseDefaultDto);
  }

  @Delete(':id')
      remove(@Param('id') id: string) {
    return this.warehouseDefaultsService.remove(+id);
  }
}

