import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PurchaseOrderApprovalsService } from './purchase-order-approvals.service';
import { CreatePurchaseOrderApprovalDto } from './dto/create-purchase-order-approval.dto';
import { UpdatePurchaseOrderApprovalDto } from './dto/update-purchase-order-approval.dto';
@Controller('purchase-order-approvals')
export class PurchaseOrderApprovalsController {
  constructor(private readonly service: PurchaseOrderApprovalsService) {}

  @Post()
  create(@Body() createDto: CreatePurchaseOrderApprovalDto) {
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
  update(@Param('id') id: string, @Body() updateDto: UpdatePurchaseOrderApprovalDto) {
    return this.service.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

