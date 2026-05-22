import { Controller, Get, Post, Delete, Param, Query, Body, Request, Res, NotFoundException } from '@nestjs/common';
import { DataExportsService } from './data-exports.service';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('data-exports')
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

  @Get(':id/download')
  async download(@Param('id') id: string, @Res() res: Response) {
    const exportRecord = await this.dataExportsService.findOne(+id);
    
    if (!exportRecord.data || exportRecord.data.status !== 'completed') {
      throw new NotFoundException('Export not found or not ready for download');
    }

    const filePath = exportRecord.data.filePath || path.join(process.cwd(), 'exports', `export-${id}.${exportRecord.data.format === 'excel' ? 'xlsx' : 'csv'}`);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Export file not found');
    }

    const fileExtension = exportRecord.data.format === 'excel' ? 'xlsx' : 'csv';
    const fileName = `${exportRecord.data.name || `export-${id}`}.${fileExtension}`;

    res.setHeader('Content-Type', fileExtension === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }
}

