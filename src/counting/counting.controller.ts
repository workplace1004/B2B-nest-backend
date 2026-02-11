import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CountingService } from './counting.service';
import { CreateCycleCountDto } from './dto/create-cycle-count.dto';
import { UpdateCycleCountDto } from './dto/update-cycle-count.dto';
import { CreatePhysicalInventoryDto } from './dto/create-physical-inventory.dto';
import { UpdatePhysicalInventoryDto } from './dto/update-physical-inventory.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('counting')
@UseGuards(JwtAuthGuard)
export class CountingController {
  constructor(private readonly countingService: CountingService) {}

  // Cycle Count Endpoints
  @Post('cycle-counts')
  createCycleCount(@Body() createCycleCountDto: CreateCycleCountDto) {
    return this.countingService.createCycleCount(createCycleCountDto);
  }

  @Get('cycle-counts')
  findAllCycleCounts(
    @Query('warehouseId') warehouseId?: string,
    @Query('status') status?: string,
  ) {
    return this.countingService.findAllCycleCounts(
      warehouseId ? +warehouseId : undefined,
      status,
    );
  }

  @Get('cycle-counts/:id')
  findOneCycleCount(@Param('id') id: string) {
    return this.countingService.findOneCycleCount(+id);
  }

  @Patch('cycle-counts/:id')
  updateCycleCount(@Param('id') id: string, @Body() updateCycleCountDto: UpdateCycleCountDto) {
    return this.countingService.updateCycleCount(+id, updateCycleCountDto);
  }

  @Delete('cycle-counts/:id')
  removeCycleCount(@Param('id') id: string) {
    return this.countingService.deleteCycleCount(+id);
  }

  @Patch('cycle-counts/:id/start')
  startCycleCount(@Param('id') id: string) {
    return this.countingService.startCycleCount(+id);
  }

  // Physical Inventory Endpoints
  @Post('physical-inventory')
  createPhysicalInventory(@Body() createPhysicalInventoryDto: CreatePhysicalInventoryDto) {
    return this.countingService.createPhysicalInventory(createPhysicalInventoryDto);
  }

  @Get('physical-inventory')
  findAllPhysicalInventories(
    @Query('warehouseId') warehouseId?: string,
    @Query('status') status?: string,
  ) {
    return this.countingService.findAllPhysicalInventories(
      warehouseId ? +warehouseId : undefined,
      status,
    );
  }

  @Get('physical-inventory/:id')
  findOnePhysicalInventory(@Param('id') id: string) {
    return this.countingService.findOnePhysicalInventory(+id);
  }

  @Patch('physical-inventory/:id')
  updatePhysicalInventory(@Param('id') id: string, @Body() updatePhysicalInventoryDto: UpdatePhysicalInventoryDto) {
    return this.countingService.updatePhysicalInventory(+id, updatePhysicalInventoryDto);
  }

  @Delete('physical-inventory/:id')
  removePhysicalInventory(@Param('id') id: string) {
    return this.countingService.deletePhysicalInventory(+id);
  }

  @Patch('physical-inventory/:id/start')
  startPhysicalInventory(@Param('id') id: string) {
    return this.countingService.startPhysicalInventory(+id);
  }
}

