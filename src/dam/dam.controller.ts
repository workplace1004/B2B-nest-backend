import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { DAMService } from './dam.service';
import { CreateDAMAssetDto } from './dto/create-dam-asset.dto';
import { UpdateDAMAssetDto } from './dto/update-dam-asset.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('dam')
@UseGuards(JwtAuthGuard)
export class DAMController {
  constructor(private readonly damService: DAMService) {}

  @Post()
  create(@Body() createDAMAssetDto: CreateDAMAssetDto) {
    return this.damService.create(createDAMAssetDto);
  }

  @Get()
  findAll(@Query('productId') productId?: string) {
    return this.damService.findAll(productId ? +productId : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.damService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDAMAssetDto: UpdateDAMAssetDto) {
    return this.damService.update(+id, updateDAMAssetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.damService.remove(+id);
  }
}

