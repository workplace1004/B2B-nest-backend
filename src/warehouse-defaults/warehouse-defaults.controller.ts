import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { WarehouseDefaultsService } from './warehouse-defaults.service';
import { CreateWarehouseDefaultDto } from './dto/create-warehouse-default.dto';
import { UpdateWarehouseDefaultDto } from './dto/update-warehouse-default.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('warehouse-defaults')
@UseGuards(JwtAuthGuard)
export class WarehouseDefaultsController {
  constructor(private readonly warehouseDefaultsService: WarehouseDefaultsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
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
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateWarehouseDefaultDto: UpdateWarehouseDefaultDto) {
    return this.warehouseDefaultsService.update(+id, updateWarehouseDefaultDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.warehouseDefaultsService.remove(+id);
  }
}

