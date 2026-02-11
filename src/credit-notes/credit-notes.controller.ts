import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CreditNotesService } from './credit-notes.service';
import { CreateCreditNoteDto } from './dto/create-credit-note.dto';
import { UpdateCreditNoteDto } from './dto/update-credit-note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('credit-notes')
@UseGuards(JwtAuthGuard)
export class CreditNotesController {
  constructor(private readonly creditNotesService: CreditNotesService) {}

  @Post()
  create(@Body() createDto: CreateCreditNoteDto) {
    return this.creditNotesService.create(createDto);
  }

  @Get()
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.creditNotesService.findAll(
      skip ? +skip : undefined,
      take ? +take : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.creditNotesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateCreditNoteDto) {
    return this.creditNotesService.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.creditNotesService.remove(+id);
  }
}



