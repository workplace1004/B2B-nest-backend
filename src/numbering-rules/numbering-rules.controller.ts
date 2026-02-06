import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { NumberingRulesService } from './numbering-rules.service';
import { CreateNumberingRuleDto } from './dto/create-numbering-rule.dto';
import { UpdateNumberingRuleDto } from './dto/update-numbering-rule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('numbering-rules')
@UseGuards(JwtAuthGuard)
export class NumberingRulesController {
  constructor(private readonly numberingRulesService: NumberingRulesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createNumberingRuleDto: CreateNumberingRuleDto) {
    return this.numberingRulesService.create(createNumberingRuleDto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
  ) {
    return this.numberingRulesService.findAll(skip ? +skip : undefined, take ? +take : undefined, type, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.numberingRulesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateNumberingRuleDto: UpdateNumberingRuleDto) {
    return this.numberingRulesService.update(+id, updateNumberingRuleDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.numberingRulesService.remove(+id);
  }

  @Patch(':id/increment-sequence')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  incrementSequence(@Param('id') id: string) {
    return this.numberingRulesService.incrementSequence(+id);
  }
}

