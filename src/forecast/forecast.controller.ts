import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ForecastService } from './forecast.service';
import { CreateForecastDto } from './dto/create-forecast.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('forecast')
@UseGuards(JwtAuthGuard)
export class ForecastController {
  constructor(private readonly forecastService: ForecastService) {}

  @Post()
  create(@Body() createForecastDto: CreateForecastDto) {
    return this.forecastService.create(createForecastDto);
  }

  @Get()
  findAll(
    @Query('productId') productId?: string,
    @Query('period') period?: string,
  ) {
    return this.forecastService.findAll(
      productId ? +productId : undefined,
      period,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.forecastService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.forecastService.remove(+id);
  }
}

