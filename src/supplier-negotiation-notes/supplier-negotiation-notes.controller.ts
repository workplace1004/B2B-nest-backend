import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SupplierNegotiationNotesService } from './supplier-negotiation-notes.service';
import { CreateSupplierNegotiationNoteDto } from './dto/create-supplier-negotiation-note.dto';
import { UpdateSupplierNegotiationNoteDto } from './dto/update-supplier-negotiation-note.dto';
@Controller('supplier-negotiation-notes')
export class SupplierNegotiationNotesController {
  constructor(private readonly service: SupplierNegotiationNotesService) {}

  @Post()
  create(@Body() createDto: CreateSupplierNegotiationNoteDto) {
    return this.service.create(createDto);
  }

  @Get()
  findAll(@Query('supplierId') supplierId?: string) {
    return this.service.findAll(supplierId ? +supplierId : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateSupplierNegotiationNoteDto) {
    return this.service.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}

