import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EndlessAisleProductsService } from './endless-aisle-products.service';
import { CreateEndlessAisleProductDto } from './dto/create-endless-aisle-product.dto';
import { UpdateEndlessAisleProductDto } from './dto/update-endless-aisle-product.dto';
@Controller('endless-aisle-products')
export class EndlessAisleProductsController {
  constructor(private readonly endlessAisleProductsService: EndlessAisleProductsService) {}

  @Post()
  create(@Body() createEndlessAisleProductDto: CreateEndlessAisleProductDto) {
    return this.endlessAisleProductsService.create(createEndlessAisleProductDto);
  }

  @Get()
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
    @Query('isAvailable') isAvailable?: string,
  ) {
    try {
      return await this.endlessAisleProductsService.findAll(
        skip ? +skip : 0,
        take ? +take : 10,
        search,
        isAvailable === 'true' ? true : isAvailable === 'false' ? false : undefined,
      );
    } catch (error) {
      console.error('Error in EndlessAisleProductsController.findAll:', error);
      throw error;
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.endlessAisleProductsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEndlessAisleProductDto: UpdateEndlessAisleProductDto) {
    return this.endlessAisleProductsService.update(+id, updateEndlessAisleProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.endlessAisleProductsService.remove(+id);
  }
}

