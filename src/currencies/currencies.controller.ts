import { Controller, Get, Param } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Get()
  findAll() {
    return this.currenciesService.findAll();
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.currenciesService.findByCode(code);
  }
}

