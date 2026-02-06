import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TaxDefaultsService } from './tax-defaults.service';
import { CreateTaxDefaultDto } from './dto/create-tax-default.dto';
import { UpdateTaxDefaultDto } from './dto/update-tax-default.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('tax-defaults')
@UseGuards(JwtAuthGuard)
export class TaxDefaultsController {
  constructor(private readonly taxDefaultsService: TaxDefaultsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
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
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateTaxDefaultDto: UpdateTaxDefaultDto) {
    return this.taxDefaultsService.update(+id, updateTaxDefaultDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.taxDefaultsService.remove(+id);
  }
}

