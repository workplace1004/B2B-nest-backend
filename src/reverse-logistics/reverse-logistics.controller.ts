import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ReverseLogisticsService } from './reverse-logistics.service';
import { CreateReverseLogisticsDto } from './dto/create-reverse-logistics.dto';
import { UpdateReverseLogisticsDto } from './dto/update-reverse-logistics.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reverse-logistics')
@UseGuards(JwtAuthGuard)
export class ReverseLogisticsController {
  constructor(private readonly service: ReverseLogisticsService) {}

  @Post()
  create(@Body() createDto: CreateReverseLogisticsDto) {
    return this.service.create(createDto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('rmaId') rmaId?: string,
    @Query('status') status?: string,
  ) {
    return this.service.findAll(
      skip ? +skip : 0,
      take ? +take : 10,
      rmaId ? +rmaId : undefined,
      status,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDto: UpdateReverseLogisticsDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}

