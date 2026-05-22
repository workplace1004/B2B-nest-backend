import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SalesRepCommissionsService } from './sales-rep-commissions.service';
import { CreateSalesRepCommissionDto } from './dto/create-sales-rep-commission.dto';
import { UpdateSalesRepCommissionDto } from './dto/update-sales-rep-commission.dto';
@Controller('sales-rep-commissions')
export class SalesRepCommissionsController {
  constructor(private readonly salesRepCommissionsService: SalesRepCommissionsService) {}

  @Post()
  create(@Body() createSalesRepCommissionDto: CreateSalesRepCommissionDto) {
    return this.salesRepCommissionsService.create(createSalesRepCommissionDto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('period') period?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.salesRepCommissionsService.findAll(
      skip ? +skip : 0,
      take ? +take : 10,
      period,
      type,
      status,
      search,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesRepCommissionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSalesRepCommissionDto: UpdateSalesRepCommissionDto) {
    return this.salesRepCommissionsService.update(+id, updateSalesRepCommissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesRepCommissionsService.remove(+id);
  }
}

