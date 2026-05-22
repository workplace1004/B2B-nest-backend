import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PickListsService } from './pick-lists.service';
import { CreatePickListDto } from './dto/create-pick-list.dto';
import { UpdatePickListDto } from './dto/update-pick-list.dto';
@Controller('pick-lists')
export class PickListsController {
  constructor(private readonly service: PickListsService) {}

  @Post()
  create(@Body() createDto: CreatePickListDto) {
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
  update(@Param('id') id: string, @Body() updateDto: UpdatePickListDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

