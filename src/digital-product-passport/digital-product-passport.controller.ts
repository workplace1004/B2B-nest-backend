import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DigitalProductPassportService } from './digital-product-passport.service';
import { CreateDigitalProductPassportDto } from './dto/create-digital-product-passport.dto';
import { UpdateDigitalProductPassportDto } from './dto/update-digital-product-passport.dto';
@Controller('digital-product-passport')
export class DigitalProductPassportController {
  constructor(private readonly service: DigitalProductPassportService) {}

  @Post()
  create(@Body() createDto: CreateDigitalProductPassportDto) {
    return this.service.create(createDto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.service.findByProduct(+productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateDigitalProductPassportDto) {
    return this.service.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}








