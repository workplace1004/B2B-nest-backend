import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { FxRatesService } from './fx-rates.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('fx-rates')
@UseGuards(JwtAuthGuard)
export class FxRatesController {
  constructor(private readonly fxRatesService: FxRatesService) {}

  @Get()
  findAll(@Query('baseCurrency') baseCurrency?: string) {
    return this.fxRatesService.findAll(baseCurrency);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fxRatesService.findOne(+id);
  }

  @Post('refresh')
  refresh(@Body() body: { baseCurrency?: string }) {
    const baseCurrency = body?.baseCurrency || 'USD';
    return this.fxRatesService.refresh(baseCurrency);
  }
}

