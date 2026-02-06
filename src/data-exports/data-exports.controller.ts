import { Controller, Get, Post, Delete, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { DataExportsService } from './data-exports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('data-exports')
@UseGuards(JwtAuthGuard)
export class DataExportsController {
  constructor(private readonly dataExportsService: DataExportsService) {}

  @Post()
  create(
    @Body() createExportDto: { name: string; format: string; type: string },
    @Request() req: any,
  ) {
    // Get user from request (set by JWT guard)
    const createdBy = req.user?.email || req.user?.firstName + ' ' + req.user?.lastName || 'System';
    return this.dataExportsService.create(createExportDto, createdBy);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.dataExportsService.findAll(
      skip ? +skip : undefined,
      take ? +take : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dataExportsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dataExportsService.remove(+id);
  }
}

