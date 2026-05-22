import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BOPISOrdersService } from './bopis-orders.service';
import { CreateBOPISOrderDto } from './dto/create-bopis-order.dto';
import { UpdateBOPISOrderDto } from './dto/update-bopis-order.dto';
@Controller('bopis-orders')
export class BOPISOrdersController {
  constructor(private readonly bopisOrdersService: BOPISOrdersService) {}

  @Post()
  create(@Body() createBOPISOrderDto: CreateBOPISOrderDto) {
    return this.bopisOrdersService.create(createBOPISOrderDto);
  }

  @Get()
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: string,
    @Query('storeId') storeId?: string,
    @Query('search') search?: string,
  ) {
    try {
      return await this.bopisOrdersService.findAll(
        skip ? +skip : 0,
        take ? +take : 10,
        status,
        storeId ? +storeId : undefined,
        search,
      );
    } catch (error) {
      console.error('Error in BOPISOrdersController.findAll:', error);
      throw error;
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bopisOrdersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBOPISOrderDto: UpdateBOPISOrderDto) {
    return this.bopisOrdersService.update(+id, updateBOPISOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bopisOrdersService.remove(+id);
  }
}

