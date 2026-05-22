import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TaxDefaultsService } from './tax-defaults.service';
import { CreateTaxDefaultDto } from './dto/create-tax-default.dto';
import { UpdateTaxDefaultDto } from './dto/update-tax-default.dto';
@Controller('tax-defaults')
export class TaxDefaultsController {
  constructor(private readonly taxDefaultsService: TaxDefaultsService) {}

  @Post()
      create(@Body() createTaxDefaultDto: CreateTaxDefaultDto) {
    return this.taxDefaultsService.create(createTaxDefaultDto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('type') type?: string,
  ) {
    return this.taxDefaultsService.findAll(skip ? +skip : undefined, take ? +take : undefined, type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taxDefaultsService.findOne(+id);
  }

  @Patch(':id')
      update(@Param('id') id: string, @Body() updateTaxDefaultDto: UpdateTaxDefaultDto) {
    return this.taxDefaultsService.update(+id, updateTaxDefaultDto);
  }

  @Delete(':id')
      remove(@Param('id') id: string) {
    return this.taxDefaultsService.remove(+id);
  }
}

