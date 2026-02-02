import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ExceptionsService } from './exceptions.service';
import { CreateExceptionDto } from './dto/create-exception.dto';
import { UpdateExceptionDto } from './dto/update-exception.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('exceptions')
@UseGuards(JwtAuthGuard)
export class ExceptionsController {
  constructor(private readonly exceptionsService: ExceptionsService) {}

  @Post()
  create(@Body() createExceptionDto: CreateExceptionDto) {
    return this.exceptionsService.create(createExceptionDto);
  }

  @Get()
  findAll(@Query('skip') skip?: string, @Query('take') take?: string, @Query('type') type?: string, @Query('status') status?: string) {
    return this.exceptionsService.findAll(skip ? +skip : undefined, take ? +take : undefined, type, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exceptionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExceptionDto: UpdateExceptionDto) {
    return this.exceptionsService.update(+id, updateExceptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exceptionsService.remove(+id);
  }
}

