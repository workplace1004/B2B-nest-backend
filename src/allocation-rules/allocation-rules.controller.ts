import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AllocationRulesService } from './allocation-rules.service';
import { CreateAllocationRuleDto } from './dto/create-allocation-rule.dto';
import { UpdateAllocationRuleDto } from './dto/update-allocation-rule.dto';
@Controller('allocation-rules')
export class AllocationRulesController {
  constructor(private readonly allocationRulesService: AllocationRulesService) {}

  @Post()
  create(@Body() createAllocationRuleDto: CreateAllocationRuleDto) {
    return this.allocationRulesService.create(createAllocationRuleDto);
  }

  @Get()
  findAll(@Query('isActive') isActive?: string) {
    return this.allocationRulesService.findAll(
      isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.allocationRulesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAllocationRuleDto: UpdateAllocationRuleDto) {
    return this.allocationRulesService.update(+id, updateAllocationRuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.allocationRulesService.remove(+id);
  }
}

