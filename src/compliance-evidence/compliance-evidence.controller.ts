import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ComplianceEvidenceService } from './compliance-evidence.service';
import { CreateComplianceEvidenceDto } from './dto/create-compliance-evidence.dto';
import { UpdateComplianceEvidenceDto } from './dto/update-compliance-evidence.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('compliance-evidence')
@UseGuards(JwtAuthGuard)
export class ComplianceEvidenceController {
  constructor(private readonly service: ComplianceEvidenceService) {}

  @Post()
  create(@Body() createDto: CreateComplianceEvidenceDto) {
    return this.service.create(createDto);
  }

  @Get()
  findAll(@Query('productId') productId?: string) {
    return this.service.findAll(productId ? +productId : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateComplianceEvidenceDto) {
    return this.service.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}


