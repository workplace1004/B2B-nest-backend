import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PackSlipsService } from './pack-slips.service';
import { CreatePackSlipDto } from './dto/create-pack-slip.dto';
import { UpdatePackSlipDto } from './dto/update-pack-slip.dto';
@Controller('pack-slips')
export class PackSlipsController {
  constructor(private readonly service: PackSlipsService) {}

  @Post()
  create(@Body() createDto: CreatePackSlipDto) {
    return this.service.create(createDto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('orderId') orderId?: string,
  ) {
    return this.service.findAll(
      skip ? +skip : 0,
      take ? +take : 10,
      status,
      warehouseId ? +warehouseId : undefined,
      orderId ? +orderId : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdatePackSlipDto) {
    try {
      return this.service.update(id, updateDto);
    } catch (error: any) {
      console.error('Pack Slip Update Error:', error);
      console.error('Update DTO:', JSON.stringify(updateDto, null, 2));
      throw error;
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

