import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { BOMService } from './bom.service';
import { CreateBOMDto } from './dto/create-bom.dto';
import { UpdateBOMDto } from './dto/update-bom.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bom')
@UseGuards(JwtAuthGuard)
export class BOMController {
  constructor(private readonly bomService: BOMService) {}

  @Post(':productId')
  create(@Param('productId') productId: string, @Body() createBOMDto: CreateBOMDto) {
    return this.bomService.create(+productId, createBOMDto);
  }

  @Get()
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.bomService.findAll(skip ? +skip : undefined, take ? +take : undefined);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.bomService.findByProduct(+productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bomService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBOMDto: UpdateBOMDto) {
    return this.bomService.update(+id, updateBOMDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bomService.remove(+id);
  }
}

