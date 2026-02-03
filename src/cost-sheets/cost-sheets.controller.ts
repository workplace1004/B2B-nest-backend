import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CostSheetsService } from './cost-sheets.service';
import { CreateCostSheetDto } from './dto/create-cost-sheet.dto';
import { UpdateCostSheetDto } from './dto/update-cost-sheet.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cost-sheets')
@UseGuards(JwtAuthGuard)
export class CostSheetsController {
  constructor(private readonly costSheetsService: CostSheetsService) {}

  @Post(':productId')
  create(@Param('productId') productId: string, @Body() createCostSheetDto: CreateCostSheetDto) {
    return this.costSheetsService.create(+productId, createCostSheetDto);
  }

  @Get()
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.costSheetsService.findAll(skip ? +skip : undefined, take ? +take : undefined);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.costSheetsService.findByProduct(+productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.costSheetsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCostSheetDto: UpdateCostSheetDto) {
    return this.costSheetsService.update(+id, updateCostSheetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.costSheetsService.remove(+id);
  }
}

