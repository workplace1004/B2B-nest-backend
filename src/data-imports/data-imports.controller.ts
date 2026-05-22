import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseInterceptors, UploadedFile, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DataImportsService } from './data-imports.service';
import { Express } from 'express';

@Controller('data-imports')
export class DataImportsController {
  constructor(private readonly dataImportsService: DataImportsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
      },
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Request() req: any,
  ) {
    // Extract type from body (when using multipart/form-data, text fields are in body)
    const type = body?.type || 'products';
    // Get user from request (set by JWT guard)
    const uploadedBy = req.user?.email || req.user?.firstName + ' ' + req.user?.lastName || 'System';
    return this.dataImportsService.create(file, type, uploadedBy);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.dataImportsService.findAll(
      skip ? +skip : undefined,
      take ? +take : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dataImportsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updates: any) {
    return this.dataImportsService.update(+id, updates);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dataImportsService.remove(+id);
  }
}

