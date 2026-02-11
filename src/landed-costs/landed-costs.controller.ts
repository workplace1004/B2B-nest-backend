import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { LandedCostsService } from './landed-costs.service';
import { CreateLandedCostDto } from './dto/create-landed-cost.dto';
import { UpdateLandedCostDto } from './dto/update-landed-cost.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('landed-costs')
@UseGuards(JwtAuthGuard)
export class LandedCostsController {
  constructor(private readonly service: LandedCostsService) {}

  @Post()
  create(@Body() createDto: CreateLandedCostDto) {
    return this.service.create(createDto);
  }

  @Get()
  findAll(@Query('orderId') orderId?: string) {
    return this.service.findAll(orderId ? +orderId : undefined);
  }

  @Get('order/:orderId')
  findByOrderId(@Param('orderId') orderId: string) {
    return this.service.findByOrderId(+orderId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateLandedCostDto) {
    return this.service.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

