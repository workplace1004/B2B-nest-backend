import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ScanHistoryService } from './scan-history.service';
import { CreateScanHistoryDto } from './dto/create-scan-history.dto';
import { UpdateScanHistoryDto } from './dto/update-scan-history.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('scan-history')
@UseGuards(JwtAuthGuard)
export class ScanHistoryController {
  constructor(private readonly service: ScanHistoryService) {}

  @Post()
  create(@Body() createDto: CreateScanHistoryDto) {
    return this.service.create(createDto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('codeType') codeType?: string,
    @Query('action') action?: string,
  ) {
    return this.service.findAll(
      skip ? +skip : 0,
      take ? +take : 10,
      warehouseId ? +warehouseId : undefined,
      codeType,
      action,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateScanHistoryDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Delete()
  removeAll() {
    return this.service.removeAll();
  }
}

