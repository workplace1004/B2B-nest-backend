import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SizeFitService } from './size-fit.service';
import { CreateSizeChartDto } from './dto/create-size-chart.dto';
import { UpdateSizeChartDto } from './dto/update-size-chart.dto';
@Controller('size-fit')
export class SizeFitController {
  constructor(private readonly sizeFitService: SizeFitService) {}

  @Post()
  create(@Body() createSizeChartDto: CreateSizeChartDto) {
    return this.sizeFitService.create(createSizeChartDto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.sizeFitService.findAll(
      skip ? +skip : 0,
      take ? +take : 10,
      category,
      search,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sizeFitService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSizeChartDto: UpdateSizeChartDto) {
    return this.sizeFitService.update(+id, updateSizeChartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sizeFitService.remove(+id);
  }
}

