import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PurchaseOrderWIPTrackingService } from './purchase-order-wip-tracking.service';
import { CreatePurchaseOrderWIPTrackingDto } from './dto/create-purchase-order-wip-tracking.dto';
import { UpdatePurchaseOrderWIPTrackingDto } from './dto/update-purchase-order-wip-tracking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('purchase-order-wip-tracking')
@UseGuards(JwtAuthGuard)
export class PurchaseOrderWIPTrackingController {
  constructor(private readonly service: PurchaseOrderWIPTrackingService) {}

  @Post()
  create(@Body() createDto: CreatePurchaseOrderWIPTrackingDto) {
    return this.service.create(createDto);
  }

  @Get()
  findAll(@Query('purchaseOrderId') purchaseOrderId?: string) {
    return this.service.findAll(purchaseOrderId ? +purchaseOrderId : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdatePurchaseOrderWIPTrackingDto) {
    return this.service.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

