import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SalesRepTerritoriesService } from './sales-rep-territories.service';
import { CreateSalesRepTerritoryDto } from './dto/create-sales-rep-territory.dto';
import { UpdateSalesRepTerritoryDto } from './dto/update-sales-rep-territory.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sales-rep-territories')
@UseGuards(JwtAuthGuard)
export class SalesRepTerritoriesController {
  constructor(private readonly salesRepTerritoriesService: SalesRepTerritoriesService) {}

  @Post()
  create(@Body() createSalesRepTerritoryDto: CreateSalesRepTerritoryDto) {
    return this.salesRepTerritoriesService.create(createSalesRepTerritoryDto);
  }

  @Get()
  findAll() {
    return this.salesRepTerritoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesRepTerritoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSalesRepTerritoryDto: UpdateSalesRepTerritoryDto) {
    return this.salesRepTerritoriesService.update(+id, updateSalesRepTerritoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesRepTerritoriesService.remove(+id);
  }
}

