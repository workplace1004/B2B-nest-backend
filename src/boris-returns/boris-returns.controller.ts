import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BORISReturnsService } from './boris-returns.service';
import { CreateBORISReturnDto } from './dto/create-boris-return.dto';
import { UpdateBORISReturnDto } from './dto/update-boris-return.dto';
@Controller('boris-returns')
export class BORISReturnsController {
  constructor(private readonly borisReturnsService: BORISReturnsService) {}

  @Post()
  create(@Body() createBORISReturnDto: CreateBORISReturnDto) {
    return this.borisReturnsService.create(createBORISReturnDto);
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
      return await this.borisReturnsService.findAll(
        skip ? +skip : 0,
        take ? +take : 10,
        status,
        storeId ? +storeId : undefined,
        search,
      );
    } catch (error) {
      console.error('Error in BORISReturnsController.findAll:', error);
      throw error;
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.borisReturnsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBORISReturnDto: UpdateBORISReturnDto) {
    return this.borisReturnsService.update(+id, updateBORISReturnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.borisReturnsService.remove(+id);
  }
}

