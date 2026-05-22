import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ServiceCasesService } from './service-cases.service';
import { CreateServiceCaseDto } from './dto/create-service-case.dto';
import { UpdateServiceCaseDto } from './dto/update-service-case.dto';
@Controller('service-cases')
export class ServiceCasesController {
  constructor(private readonly serviceCasesService: ServiceCasesService) {}

  @Post()
  create(@Body() createServiceCaseDto: CreateServiceCaseDto) {
    return this.serviceCasesService.create(createServiceCaseDto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('search') search?: string,
  ) {
    return this.serviceCasesService.findAll(
      skip ? +skip : 0,
      take ? +take : 10,
      status,
      priority,
      search,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceCasesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceCaseDto: UpdateServiceCaseDto) {
    return this.serviceCasesService.update(+id, updateServiceCaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceCasesService.remove(+id);
  }
}

