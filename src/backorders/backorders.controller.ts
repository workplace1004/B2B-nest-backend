import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { BackordersService } from './backorders.service';
import { CreateBackorderDto } from './dto/create-backorder.dto';
import { UpdateBackorderDto } from './dto/update-backorder.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('backorders')
@UseGuards(JwtAuthGuard)
export class BackordersController {
  constructor(private readonly backordersService: BackordersService) {}

  @Post()
  create(@Body() createBackorderDto: CreateBackorderDto) {
    return this.backordersService.create(createBackorderDto);
  }

  @Get()
  findAll(
    @Query('orderId') orderId?: string,
    @Query('status') status?: string,
  ) {
    return this.backordersService.findAll(
      orderId ? +orderId : undefined,
      status,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.backordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBackorderDto: UpdateBackorderDto) {
    return this.backordersService.update(+id, updateBackorderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.backordersService.remove(+id);
  }
}

