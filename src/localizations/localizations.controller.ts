import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { LocalizationsService } from './localizations.service';
import { CreateLocalizationDto } from './dto/create-localization.dto';
import { UpdateLocalizationDto } from './dto/update-localization.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('localizations')
@UseGuards(JwtAuthGuard)
export class LocalizationsController {
  constructor(private readonly localizationsService: LocalizationsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
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
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateLocalizationDto: UpdateLocalizationDto) {
    return this.localizationsService.update(+id, updateLocalizationDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.localizationsService.remove(+id);
  }
}

