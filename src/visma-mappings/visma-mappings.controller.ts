import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { VismaMappingsService, VismaMapping } from './visma-mappings.service';
import { CreateVismaMappingDto } from './dto/create-visma-mapping.dto';
import { UpdateVismaMappingDto } from './dto/update-visma-mapping.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('visma-mappings')
@UseGuards(JwtAuthGuard)
export class VismaMappingsController {
  constructor(private readonly vismaMappingsService: VismaMappingsService) {}

  @Post()
  create(@Body() createVismaMappingDto: CreateVismaMappingDto): { data: VismaMapping } {
    return this.vismaMappingsService.create(createVismaMappingDto);
  }

  @Get()
  findAll() {
    return this.vismaMappingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vismaMappingsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateVismaMappingDto: UpdateVismaMappingDto) {
    return this.vismaMappingsService.update(+id, updateVismaMappingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vismaMappingsService.remove(+id);
  }
}

