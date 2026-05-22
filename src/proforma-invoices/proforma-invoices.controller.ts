import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProformaInvoicesService } from './proforma-invoices.service';
import { CreateProformaInvoiceDto } from './dto/create-proforma-invoice.dto';
import { UpdateProformaInvoiceDto } from './dto/update-proforma-invoice.dto';
@Controller('proforma-invoices')
export class ProformaInvoicesController {
  constructor(private readonly proformaInvoicesService: ProformaInvoicesService) {}

  @Post()
  create(@Body() createProformaInvoiceDto: CreateProformaInvoiceDto) {
    return this.proformaInvoicesService.create(createProformaInvoiceDto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: string,
    @Query('customerId') customerId?: string,
  ) {
    return this.proformaInvoicesService.findAll(
      skip ? +skip : 0,
      take ? +take : 10,
      status,
      customerId ? +customerId : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proformaInvoicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProformaInvoiceDto: UpdateProformaInvoiceDto) {
    return this.proformaInvoicesService.update(+id, updateProformaInvoiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proformaInvoicesService.remove(+id);
  }
}

