import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { VismaMappingsService } from './visma-mappings.service';
import { CreateVismaMappingDto } from './dto/create-visma-mapping.dto';
import { UpdateVismaMappingDto } from './dto/update-visma-mapping.dto';
@Controller('visma-mappings')
export class VismaMappingsController {
  constructor(private readonly vismaMappingsService: VismaMappingsService) {}

  @Post()
  create(@Body() createVismaMappingDto: CreateVismaMappingDto) {
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

