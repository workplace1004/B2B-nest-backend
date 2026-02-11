import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PurchaseOrderBatchesService } from './purchase-order-batches.service';
import { CreatePurchaseOrderBatchDto } from './dto/create-purchase-order-batch.dto';
import { UpdatePurchaseOrderBatchDto } from './dto/update-purchase-order-batch.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('purchase-order-batches')
@UseGuards(JwtAuthGuard)
export class PurchaseOrderBatchesController {
  constructor(private readonly service: PurchaseOrderBatchesService) {}

  @Post()
  create(@Body() createDto: CreatePurchaseOrderBatchDto) {
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
  update(@Param('id') id: string, @Body() updateDto: UpdatePurchaseOrderBatchDto) {
    return this.service.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

