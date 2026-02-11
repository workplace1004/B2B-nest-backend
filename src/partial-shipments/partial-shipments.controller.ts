import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PartialShipmentsService } from './partial-shipments.service';
import { CreatePartialShipmentDto } from './dto/create-partial-shipment.dto';
import { UpdatePartialShipmentDto } from './dto/update-partial-shipment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('partial-shipments')
@UseGuards(JwtAuthGuard)
export class PartialShipmentsController {
  constructor(private readonly partialShipmentsService: PartialShipmentsService) {}

  @Post()
  create(@Body() createPartialShipmentDto: CreatePartialShipmentDto) {
    return this.partialShipmentsService.create(createPartialShipmentDto);
  }

  @Get()
  findAll(
    @Query('orderId') orderId?: string,
    @Query('status') status?: string,
  ) {
    return this.partialShipmentsService.findAll(
      orderId ? +orderId : undefined,
      status,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partialShipmentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePartialShipmentDto: UpdatePartialShipmentDto) {
    return this.partialShipmentsService.update(+id, updatePartialShipmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partialShipmentsService.remove(+id);
  }
}

