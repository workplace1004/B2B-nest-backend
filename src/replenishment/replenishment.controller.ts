import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ReplenishmentService } from './replenishment.service';
import { CreateReplenishmentDto } from './dto/create-replenishment.dto';
import { UpdateReplenishmentDto } from './dto/update-replenishment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('replenishment')
@UseGuards(JwtAuthGuard)
export class ReplenishmentController {
  constructor(private readonly replenishmentService: ReplenishmentService) {}

  @Post()
  create(@Body() createReplenishmentDto: CreateReplenishmentDto) {
    return this.replenishmentService.create(createReplenishmentDto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('productId') productId?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('status') status?: string,
  ) {
    return this.replenishmentService.findAll(
      skip ? +skip : undefined,
      take ? +take : undefined,
      productId ? +productId : undefined,
      warehouseId ? +warehouseId : undefined,
      status,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.replenishmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReplenishmentDto: UpdateReplenishmentDto) {
    return this.replenishmentService.update(+id, updateReplenishmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.replenishmentService.remove(+id);
  }
}

