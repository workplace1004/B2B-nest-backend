import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ShippingLabelsService } from './shipping-labels.service';
import { CreateShippingLabelDto } from './dto/create-shipping-label.dto';
import { UpdateShippingLabelDto } from './dto/update-shipping-label.dto';
@Controller('shipping-labels')
export class ShippingLabelsController {
  constructor(private readonly service: ShippingLabelsService) {}

  @Post()
  create(@Body() createDto: CreateShippingLabelDto) {
    return this.service.create(createDto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: string,
    @Query('orderId') orderId?: string,
    @Query('packSlipId') packSlipId?: string,
  ) {
    return this.service.findAll(
      skip ? +skip : 0,
      take ? +take : 10,
      status,
      orderId ? +orderId : undefined,
      packSlipId,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateShippingLabelDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

