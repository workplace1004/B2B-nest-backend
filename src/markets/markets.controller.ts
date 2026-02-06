import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('markets')
@UseGuards(JwtAuthGuard)
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createMarketDto: CreateMarketDto) {
    return this.marketsService.create(createMarketDto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: string,
  ) {
    return this.marketsService.findAll(skip ? +skip : undefined, take ? +take : undefined, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marketsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateMarketDto: UpdateMarketDto) {
    return this.marketsService.update(+id, updateMarketDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.marketsService.remove(+id);
  }
}

