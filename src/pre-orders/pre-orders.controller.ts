import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PreOrdersService } from './pre-orders.service';
import { CreatePreOrderDto } from './dto/create-pre-order.dto';
import { UpdatePreOrderDto } from './dto/update-pre-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('pre-orders')
@UseGuards(JwtAuthGuard)
export class PreOrdersController {
  constructor(private readonly preOrdersService: PreOrdersService) {}

  @Post()
  create(@Body() createPreOrderDto: CreatePreOrderDto) {
    return this.preOrdersService.create(createPreOrderDto);
  }

  @Get()
  findAll(
    @Query('orderId') orderId?: string,
    @Query('status') status?: string,
  ) {
    return this.preOrdersService.findAll(
      orderId ? +orderId : undefined,
      status,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.preOrdersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePreOrderDto: UpdatePreOrderDto) {
    return this.preOrdersService.update(+id, updatePreOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.preOrdersService.remove(+id);
  }
}

