import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LocalizationsService } from './localizations.service';
import { CreateLocalizationDto } from './dto/create-localization.dto';
import { UpdateLocalizationDto } from './dto/update-localization.dto';
@Controller('localizations')
export class LocalizationsController {
  constructor(private readonly localizationsService: LocalizationsService) {}

  @Post()
      create(@Body() createLocalizationDto: CreateLocalizationDto) {
    return this.localizationsService.create(createLocalizationDto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.localizationsService.findAll(skip ? +skip : undefined, take ? +take : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.localizationsService.findOne(+id);
  }

  @Get('market/:marketId')
  findByMarketId(@Param('marketId') marketId: string) {
    return this.localizationsService.findByMarketId(+marketId);
  }

  @Patch(':id')
      update(@Param('id') id: string, @Body() updateLocalizationDto: UpdateLocalizationDto) {
    return this.localizationsService.update(+id, updateLocalizationDto);
  }

  @Delete(':id')
      remove(@Param('id') id: string) {
    return this.localizationsService.remove(+id);
  }
}

